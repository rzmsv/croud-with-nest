import { Controller, Post, Req, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { authDTO } from "./dto";

@Controller("auth")
export class authController {
    authService: AuthService
    constructor(authService: AuthService) {
        this.authService = authService
    }

    @Post("signup")
    signup(@Body() dto: authDTO) {
        return this.authService.signup(dto)
    }

    @Post("signin")
    signin(@Body() dto: authDTO) {
        return this.authService.signin(dto)
    }
}