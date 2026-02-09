import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug("[ROLES-GUARD] User from request:", user ? JSON.stringify(user) : "NULL/UNDEFINED");
    this.logger.debug("[ROLES-GUARD] Required roles:", requiredRoles);

    if (!user) {
      this.logger.error("[ROLES-GUARD] No user found in request!");
      throw new ForbiddenException("No user found");
    }

    const hasRole = () => requiredRoles.some((role) => user.role === role);

    if (!hasRole()) {
      this.logger.warn("[ROLES-GUARD] User role mismatch - user.role:", user.role, "required:", requiredRoles);
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }
}
