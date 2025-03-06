import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {}

  async signIn(username: string) {
    let user = await this.firebaseService.getUserByUsername(username);

    if (!user) {
      user = await this.firebaseService.createUser(username);
    }

    const payload = { id: user.id, username: user.username };

    return {
      jwt: this.jwtService.sign(payload),
    };
  }
}
