import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private EXPIRATION_TIME = "1 day";
    private ISSUER = "E-Natal";
    private AUDIENCE = "Sr. Claus"

    constructor(private readonly jwtService: JwtService) { }

    async signIn(signInDto: SignInDto) {
        const username = process.env.ADMIN_USER;
        const password = process.env.PASSWORD;

        if(username === signInDto.username && password === signInDto.password) {
            return this.createToken(signInDto);
        } else {
            throw new UnauthorizedException("Username or password not valid.");
        }

    }

    createToken(user: SignInDto) {
        const { username } = user;
        const token = this.jwtService.sign({username}, { 
            expiresIn: this.EXPIRATION_TIME,
            subject: String(username),
            issuer: this.ISSUER,
            audience: this.AUDIENCE
        })

        return { token };
    }

    checkToken(token: string) {
        const data = this.jwtService.verify(token, {
            audience: this.AUDIENCE,
            issuer: this.ISSUER
        });

        return data;
    }
}
