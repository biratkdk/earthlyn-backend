import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call parent canActivate which runs Passport validation
    const result = await super.canActivate(context);
    
    if (!result) {
      return false;
    }
    
    // After validation succeeds, explicitly attach user to request for RolesGuard
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      console.log("[JWT-AUTH-GUARD] SUCCESS - User attached to request:", JSON.stringify(request.user));
    } else {
      console.log("[JWT-AUTH-GUARD] WARNING: JWT validated but no user on request");
    }
    
    return true;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}
