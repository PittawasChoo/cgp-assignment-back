import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

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
    const username = req.user.username;
    return this.firebaseService.createPost(
      community,
      userId,
      username,
      title,
      detail,
    );
  }

  // add comment
  @UseGuards(AuthGuard('jwt'))
  @Post('comment')
  async addComment(
    @Request() req,
    @Body('postId') postId: string,
    @Body('detail') detail: string,
  ) {
    const userId = req.user.id;
    const username = req.user.username;
    return this.firebaseService.addComment(postId, userId, username, detail);
  }

  // get post
  @Get('post')
  async getAllPosts() {
    return this.firebaseService.getAllPosts();
  }

  // get post by id
  @Get('post/:id')
  async getPostById(@Param('id') id: string) {
    return this.firebaseService.getPostById(id);
  }

  // get my post
  @UseGuards(AuthGuard('jwt'))
  @Get('my-post')
  async getUserPosts(@Request() req) {
    const userId = req.user.id;
    return this.firebaseService.getUserPosts(userId);
  }

  // edit post
  @UseGuards(AuthGuard('jwt'))
  @Patch('post/:id')
  async updatePost(
    @Request() req,
    @Param('id') postId: string,
    @Body() updates: { title?: string; detail?: string; community?: string },
  ) {
    const userId = req.user.id;
    return this.firebaseService.updatePost(postId, userId, updates);
  }

  // delete post
  @UseGuards(AuthGuard('jwt'))
  @Delete('post/:id')
  async deletePost(@Request() req, @Param('id') postId: string) {
    const userId = req.user.id;
    return this.firebaseService.deletePost(postId, userId);
  }
}
