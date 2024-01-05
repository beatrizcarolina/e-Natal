import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private readonly authService: AuthService) { }


    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest(); 
        const { authorization } = request.headers;

        try {
            const data = this.authService.checkToken((authorization ?? "").split(" ")[1]);
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    } 

}