import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context?: ExecutionContext): any {
    if (err || !user) {
      throw err || new Error("Unauthorized");
    }
    return user;
  }
}