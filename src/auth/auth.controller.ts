import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  /**
   * 新規登録処理
   * @param dto
   * @returns
   */
  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authservice.signUp(dto);
  }

  /**
   * ログイン処理
   * @param dto
   * @param res
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authservice.login(dto);
    // cookieを設定していく処理
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
