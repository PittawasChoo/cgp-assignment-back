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
}
