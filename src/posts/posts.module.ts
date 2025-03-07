import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  controllers: [PostsController],
  providers: [FirebaseService],
})
export class PostsModule {}
