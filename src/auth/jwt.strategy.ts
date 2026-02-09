import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    const secret = configService.get<string>("jwt.secret");
    console.log("[JWT-INIT] JWT Strategy initialized with secret:", secret ? secret.substring(0, 10) + "..." : "MISSING");
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: any) {
    this.logger.debug("[JWT-VALIDATE] Payload received:", JSON.stringify(payload));
    
    const user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    
    this.logger.debug("[JWT-VALIDATE] Returning user object:", JSON.stringify(user));
    return user;
  }
}
