import { Injectable } from '@nestjs/common';
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

  async createPost(
    community: string,
    userId: string,
    title: string,
    detail: string,
  ) {
    const postRef = await this.db.collection('posts').add({
      community,
      createdBy: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      title,
      detail,
    });

    return { id: postRef.id, community, createdBy: userId, title, detail };
  }

  async getAllPosts() {
    const snapshot = await this.db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getUserPosts(userId: string) {
    const snapshot = await this.db
      .collection('posts')
      .where('createdBy', '==', userId)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
