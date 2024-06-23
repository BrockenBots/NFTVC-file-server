import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UserRequest } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessGuard } from './guards/access.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(createUserDto);
    res.cookie('refresh', tokens.refreshToken, { httpOnly: true });
    return tokens;
  }

  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(email, password);
    res.cookie('refresh', tokens.refreshToken, { httpOnly: true });
    return tokens;
  }

  @UseGuards(AccessGuard)
  @Get('logout')
  logout(@Req() req: UserRequest, @Res({ passthrough: true }) res: Response) {
    res.cookie('refresh', '', { httpOnly: true });
    this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  refreshTokens(@Req() req: UserRequest) {
    const refreshToken = req?.cookies['refresh'];
    const tokenData = this.jwtService.decode(refreshToken);
    return this.authService.refreshTokens(tokenData.sub, refreshToken);
  }
}
