import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    // Call parent canActivate which runs Passport validation
    const result = super.canActivate(context);
    
    // After validation, explicitly attach user to request
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      console.log("[JWT-AUTH-GUARD] User attached to request:", JSON.stringify(request.user));
    } else {
      console.log("[JWT-AUTH-GUARD] WARNING: No user found after validation");
    }
    
    return result;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}
