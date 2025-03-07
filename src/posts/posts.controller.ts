import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class PostsController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // create new post
  @UseGuards(AuthGuard('jwt'))
  @Post('post')
  async createPost(
    @Request() req,
    @Body('community') community: string,
    @Body('title') title: string,
    @Body('detail') detail: string,
  ) {
    const userId = req.user.id;
    return this.firebaseService.createPost(community, userId, title, detail);
  }

  // get post
  @Get('post')
  async getAllPosts() {
    return this.firebaseService.getAllPosts();
  }

  // get my post
  @UseGuards(AuthGuard('jwt'))
  @Get('my-post')
  async getUserPosts(@Request() req) {
    const userId = req.user.id;
    return this.firebaseService.getUserPosts(userId);
  }
}
