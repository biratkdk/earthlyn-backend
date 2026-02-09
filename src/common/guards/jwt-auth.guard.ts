import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException("Unauthorized");
    }
    // CRITICAL: Explicitly attach user to request so RolesGuard can access it
    const request = context.switchToHttp().getRequest();
    request.user = user;
    console.log("[JWT-AUTH-GUARD] User attached to request:", JSON.stringify(user));
    return user;
  }
}
