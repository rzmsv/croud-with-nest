import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { authDTO } from "./dto";
import * as argon from "argon2"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
    async signup(dto: authDTO) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }

            });
            delete user.hash
            return user
        } catch (error) {
            if (error.code === "P2002") {
                throw new ForbiddenException('Credentials error!',)
            }
            throw error;
        }

    }
    async signin(dto: authDTO) {
        // find user
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
        if (!user) {
            throw new NotFoundException("user not found!")
        }

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password)
        if (!pwMatches) {
            throw new ForbiddenException('Credentials error!')
        }

        return this.signToken(user.id, user.email)

    }
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const secret = this.config.get("JWT_SECRET")

        const payload = {
            sub: userId,
            email
        }

        const token = await this.jwt.signAsync(payload, { expiresIn: "15m", secret })

        return { access_token: token }
    }
}