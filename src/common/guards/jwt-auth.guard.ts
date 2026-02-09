import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    this.logger.debug(`[JWT-AUTH-GUARD] Auth header: ${authHeader ? "Present" : "MISSING"}`);
    
    try {
      const result = await super.canActivate(context);
      
      if (!result) {
        this.logger.error("[JWT-AUTH-GUARD] Super canActivate returned false");
        return false;
      }
      
      if (request.user) {
        this.logger.debug(`[JWT-AUTH-GUARD] SUCCESS - User: ${JSON.stringify(request.user)}`);
      } else {
        this.logger.error("[JWT-AUTH-GUARD] ERROR: User not attached to request after JWT validation");
        throw new UnauthorizedException("JWT validated but user not attached");
      }
      
      return true;
    } catch (error) {
      this.logger.error(`[JWT-AUTH-GUARD] Exception: ${error.message}`);
      throw error;
    }
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Unauthorized - No token or invalid token");
    }
    return user;
  }
}
