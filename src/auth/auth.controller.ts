import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body('username') username: string) {
    if (!username || typeof username !== 'string') {
      throw new BadRequestException(
        'Username is required and must be a string',
      );
    }

    return this.authService.signIn(username);
  }
}
