import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private db: FirebaseFirestore.Firestore;

  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          require('../../firebase-admin-sdk.json'),
        ),
      });
    }
    this.db = admin.firestore();
  }

  async getUserByUsername(username: string) {
    const snapshot = await this.db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, username: doc.data().username };
  }

  async createUser(username: string) {
    const docRef = await this.db.collection('users').add({ username });
    return { id: docRef.id, username };
  }

  async updatePost(
    postId: string,
    userId: string,
    updates: { title?: string; detail?: string; community?: string },
  ) {
    const postRef = this.db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();
    if (postData?.createdById !== userId) {
      throw new UnauthorizedException(
        'Unauthorized: You can only edit your own post',
      );
    }

    await postRef.update(updates);

    return { id: postId, ...updates };
  }

  async createPost(
    community: string,
    userId: string,
    username: string,
    title: string,
    detail: string,
  ) {
    const postRef = await this.db.collection('posts').add({
      community,
      createdBy: username,
      createdById: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      title,
      detail,
    });

    return { id: postRef.id, community, createdBy: userId, title, detail };
  }

  async addComment(
    postId: string,
    userId: string,
    username: string,
    detail: string,
  ) {
    const commentRef = await this.db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add({
        createdBy: username,
        createdById: userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        detail,
      });

    return { id: commentRef.id, postId, createdBy: username, detail };
  }

  async getAllPosts() {
    const snapshot = await this.db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .get();

    const posts = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const commentsSnapshot = await doc.ref.collection('comments').get();
        return {
          id: doc.id,
          ...doc.data(),
          commentsCount: commentsSnapshot.size,
        };
      }),
    );

    return posts;
  }

  async getPostById(postId: string) {
    const postDoc = await this.db.collection('posts').doc(postId).get();
    if (!postDoc.exists) throw new Error('Post not found');

    const commentsSnapshot = await this.db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'asc')
      .get();

    const comments = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      id: postDoc.id,
      ...postDoc.data(),
      comments,
    };
  }

  async getUserPosts(userId: string) {
    const snapshot = await this.db
      .collection('posts')
      .where('createdById', '==', userId)
      .get();

    const posts = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const commentsSnapshot = await doc.ref.collection('comments').get();
        return {
          id: doc.id,
          ...doc.data(),
          commentsCount: commentsSnapshot.size,
        };
      }),
    );

    return posts;
  }

  async deletePost(postId: string, userId: string) {
    const postRef = this.db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      throw new NotFoundException('Post not found');
    }

    const postData = postDoc.data();
    if (postData?.createdById !== userId) {
      throw new UnauthorizedException(
        'Unauthorized: You cannot delete this post',
      );
    }

    const commentsRef = postRef.collection('comments');
    const commentsSnapshot = await commentsRef.get();
    const batch = this.db.batch();

    commentsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(postRef);
    await batch.commit();

    return { message: 'Post deleted successfully' };
  }
}
