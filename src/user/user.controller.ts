import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express"

@Controller('user')
@UseGuards(AuthGuard('jwt'))

export class UserController {
    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe(@Query("id") id: string, @Req() req: Request) {
        console.log(id)
        return req.user
    }
}
