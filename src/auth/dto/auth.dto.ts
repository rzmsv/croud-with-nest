import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class authDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}