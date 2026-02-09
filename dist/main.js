/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const config_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(7);
const throttler_1 = __webpack_require__(8);
const schedule_1 = __webpack_require__(9);
const database_module_1 = __webpack_require__(10);
const app_controller_1 = __webpack_require__(13);
const auth_module_1 = __webpack_require__(14);
const seller_module_1 = __webpack_require__(26);
const buyer_module_1 = __webpack_require__(31);
const admin_module_1 = __webpack_require__(36);
const messaging_module_1 = __webpack_require__(41);
const order_module_1 = __webpack_require__(47);
const payment_module_1 = __webpack_require__(54);
const product_module_1 = __webpack_require__(59);
const product_approval_module_1 = __webpack_require__(66);
const seller_kyc_module_1 = __webpack_require__(69);
const delivery_management_module_1 = __webpack_require__(74);
const message_moderation_module_1 = __webpack_require__(77);
const analytics_module_1 = __webpack_require__(80);
const privacy_module_1 = __webpack_require__(83);
const customer_service_module_1 = __webpack_require__(88);
const websocket_module_1 = __webpack_require__(92);
const configuration_1 = __importDefault(__webpack_require__(97));
const roles_guard_1 = __webpack_require__(40);
const disputes_module_1 = __webpack_require__(98);
const referrals_module_1 = __webpack_require__(103);
const subscriptions_module_1 = __webpack_require__(107);
const fulfillment_module_1 = __webpack_require__(111);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: ".env",
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    throttlers: [
                        {
                            ttl: Number(configService.get("THROTTLE_TTL") || 60),
                            limit: Number(configService.get("THROTTLE_LIMIT") || 10),
                        },
                    ],
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory: (configService) => ({
                    secret: configService.get("jwt.secret"),
                    signOptions: {
                        expiresIn: configService.get("jwt.expiresIn"),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            seller_module_1.SellerModule,
            buyer_module_1.BuyerModule,
            admin_module_1.AdminModule,
            messaging_module_1.MessagingModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            product_module_1.ProductModule,
            product_approval_module_1.ProductApprovalModule,
            seller_kyc_module_1.SellerKycModule,
            delivery_management_module_1.DeliveryManagementModule,
            message_moderation_module_1.MessageModerationModule,
            analytics_module_1.AnalyticsModule,
            privacy_module_1.PrivacyModule,
            customer_service_module_1.CustomerServiceModule,
            websocket_module_1.WebSocketModule,
            disputes_module_1.DisputesModule,
            referrals_module_1.ReferralsModule,
            subscriptions_module_1.SubscriptionsModule,
            fulfillment_module_1.FulfillmentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], DatabaseModule);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(12);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(2);
let AppController = class AppController {
    constructor() {
        this.startTime = Date.now();
    }
    root() {
        return {
            status: 'EARTHLYN Backend Running',
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.startTime,
        };
    }
    health() {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.startTime,
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "health", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
const auth_service_1 = __webpack_require__(16);
const auth_controller_1 = __webpack_require__(18);
const jwt_strategy_1 = __webpack_require__(24);
const database_module_1 = __webpack_require__(10);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule, database_module_1.DatabaseModule],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(7);
const bcrypt = __importStar(__webpack_require__(17));
const config_1 = __webpack_require__(6);
const prisma_service_1 = __webpack_require__(11);
let AuthService = class AuthService {
    constructor(prismaService, jwtService, configService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.VALID_ROLES = ['ADMIN', 'SELLER', 'BUYER', 'CUSTOMER_SERVICE'];
    }
    async register(registerDto) {
        const existingUser = await this.prismaService.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser)
            throw new common_1.ConflictException('User already exists');
        const normalizedRole = registerDto.role?.toUpperCase().trim();
        if (!normalizedRole || !this.VALID_ROLES.includes(normalizedRole)) {
            throw new common_1.BadRequestException('Invalid role. Must be one of: ADMIN, SELLER, BUYER, CUSTOMER_SERVICE');
        }
        if ((normalizedRole === 'ADMIN' || normalizedRole === 'CUSTOMER_SERVICE') &&
            process.env.ALLOW_ADMIN_REGISTRATION !== 'true') {
            throw new common_1.BadRequestException('Role not allowed for public registration');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, this.configService.get('bcrypt.rounds') || 10);
        const user = await this.prismaService.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name,
                passwordHash: hashedPassword,
                role: normalizedRole,
            },
        });
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async login(loginDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async validateUser(userId) {
        return await this.prismaService.user.findUnique({
            where: { id: userId },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(16);
const login_dto_1 = __webpack_require__(19);
const register_dto_1 = __webpack_require__(21);
const jwt_auth_guard_1 = __webpack_require__(22);
const current_user_decorator_1 = __webpack_require__(23);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        if (!registerDto.email || !registerDto.password || !registerDto.role) {
            throw new common_1.BadRequestException('Missing required fields');
        }
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        if (!loginDto.email || !loginDto.password) {
            throw new common_1.BadRequestException('Email and password required');
        }
        return this.authService.login(loginDto);
    }
    async validate(user) {
        return this.authService.validateUser(user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('validate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validate", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(20);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(20);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Unauthorized');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentUser = void 0;
const common_1 = __webpack_require__(2);
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
const passport_jwt_1 = __webpack_require__(25);
const config_1 = __webpack_require__(6);
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        const secret = configService.get("jwt.secret");
        console.log("[JWT-INIT] JWT Strategy initialized with secret:", secret ? secret.substring(0, 10) + "..." : "MISSING");
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
        this.logger = new common_1.Logger(JwtStrategy_1.name);
    }
    validate(payload) {
        this.logger.debug("[JWT-VALIDATE] Payload received:", JSON.stringify(payload));
        const user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        this.logger.debug("[JWT-VALIDATE] Returning user object:", JSON.stringify(user));
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerModule = void 0;
const common_1 = __webpack_require__(2);
const seller_service_1 = __webpack_require__(27);
const seller_controller_1 = __webpack_require__(28);
const database_module_1 = __webpack_require__(10);
let SellerModule = class SellerModule {
};
exports.SellerModule = SellerModule;
exports.SellerModule = SellerModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [seller_service_1.SellerService],
        controllers: [seller_controller_1.SellerController],
    })
], SellerModule);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let SellerService = class SellerService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createSellerDto) {
        return this.prismaService.seller.create({ data: { ...createSellerDto } });
    }
    async findAll() {
        return this.prismaService.seller.findMany();
    }
    async findOne(id) {
        return this.prismaService.seller.findUnique({ where: { id } });
    }
    async findByUserId(userId) {
        return this.prismaService.seller.findUnique({
            where: { userId },
            include: { user: true },
        });
    }
    async update(id, data) {
        return this.prismaService.seller.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prismaService.seller.delete({ where: { id } });
    }
    async getProfitSummary(sellerId) {
        const seller = await this.prismaService.seller.findUnique({
            where: { id: sellerId },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        const orders = await this.prismaService.order.findMany({
            where: {
                product: { sellerId },
                status: 'DELIVERED',
            },
            include: {
                product: true,
            },
        });
        const profitByTier = {
            SEED: 0,
            SPROUT: 0,
            GROWTH: 0,
            BLOOM: 0,
            EVERGREEN: 0,
            EARTH_GUARDIAN: 0,
        };
        let totalEarnings = 0;
        const transactions = await this.prismaService.transaction.findMany({
            where: {
                userId: seller.userId,
                type: 'CREDIT',
                referenceType: 'ORDER_DELIVERY',
            },
        });
        transactions.forEach((tx) => {
            totalEarnings += Number(tx.amount);
        });
        profitByTier[seller.tier] = totalEarnings;
        return {
            totalSales: Number(seller.totalSales),
            totalEarnings,
            profitByTier,
            currentTier: seller.tier,
            orderCount: orders.length,
        };
    }
    async getEarningsSummary(sellerId, startDate, endDate) {
        const seller = await this.prismaService.seller.findUnique({
            where: { id: sellerId },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        const where = {
            userId: seller.userId,
            type: 'CREDIT',
            referenceType: 'ORDER_DELIVERY',
        };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const transactions = await this.prismaService.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        const totalEarnings = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
        const totalOrders = transactions.length;
        const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;
        return {
            totalEarnings,
            totalOrders,
            averageOrderValue,
            transactions,
        };
    }
};
exports.SellerService = SellerService;
exports.SellerService = SellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SellerService);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerController = void 0;
const common_1 = __webpack_require__(2);
const seller_service_1 = __webpack_require__(27);
const create_seller_dto_1 = __webpack_require__(29);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let SellerController = class SellerController {
    constructor(sellerService) {
        this.sellerService = sellerService;
    }
    create(req, createSellerDto) {
        return this.sellerService.create({ ...createSellerDto, userId: req.user.id });
    }
    findAll() { return this.sellerService.findAll(); }
    async findByUserId(userId) {
        return this.sellerService.findByUserId(userId);
    }
    async getEarnings(id, req, startDate, endDate) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const seller = await this.sellerService.findOne(id);
            if (!seller || seller.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized to view earnings');
            }
        }
        const startDateObj = startDate ? new Date(startDate) : undefined;
        const endDateObj = endDate ? new Date(endDate) : undefined;
        return this.sellerService.getEarningsSummary(id, startDateObj, endDateObj);
    }
    async getProfitSummary(id, req) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const seller = await this.sellerService.findOne(id);
            if (!seller || seller.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized to view profit summary');
            }
        }
        return this.sellerService.getProfitSummary(id);
    }
    findOne(id) { return this.sellerService.findOne(id); }
    async update(req, id, data) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const seller = await this.sellerService.findOne(id);
            if (!seller || seller.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        return this.sellerService.update(id, data);
    }
    async remove(req, id) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const seller = await this.sellerService.findOne(id);
            if (!seller || seller.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        return this.sellerService.remove(id);
    }
};
exports.SellerController = SellerController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_seller_dto_1.CreateSellerDto !== "undefined" && create_seller_dto_1.CreateSellerDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-user/:userId'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellerController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id/earnings'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], SellerController.prototype, "getEarnings", null);
__decorate([
    (0, common_1.Get)(':id/profit-summary'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SellerController.prototype, "getProfitSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SellerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SellerController.prototype, "remove", null);
exports.SellerController = SellerController = __decorate([
    (0, common_1.Controller)('sellers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof seller_service_1.SellerService !== "undefined" && seller_service_1.SellerService) === "function" ? _a : Object])
], SellerController);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSellerDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateSellerDto {
}
exports.CreateSellerDto = CreateSellerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSellerDto.prototype, "processingFee", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "storeDescription", void 0);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.UserRole = void 0;
const common_1 = __webpack_require__(2);
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SELLER"] = "SELLER";
    UserRole["BUYER"] = "BUYER";
    UserRole["CUSTOMER_SERVICE"] = "CUSTOMER_SERVICE";
})(UserRole || (exports.UserRole = UserRole = {}));
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuyerModule = void 0;
const common_1 = __webpack_require__(2);
const buyer_service_1 = __webpack_require__(32);
const buyer_controller_1 = __webpack_require__(33);
const database_module_1 = __webpack_require__(10);
let BuyerModule = class BuyerModule {
};
exports.BuyerModule = BuyerModule;
exports.BuyerModule = BuyerModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [buyer_service_1.BuyerService],
        controllers: [buyer_controller_1.BuyerController],
    })
], BuyerModule);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuyerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let BuyerService = class BuyerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBuyerDto) {
        return this.prisma.buyer.create({
            data: { userId: createBuyerDto.userId },
            include: { user: true },
        });
    }
    async findOne(id) {
        return this.prisma.buyer.findUnique({
            where: { id },
            include: { user: true },
        });
    }
    async findByUserId(userId) {
        return this.prisma.buyer.findUnique({
            where: { userId },
            include: { user: true },
        });
    }
    async findAll() {
        return this.prisma.buyer.findMany({
            include: { user: true },
        });
    }
    async update(id, data) {
        return this.prisma.buyer.update({
            where: { id },
            data,
            include: { user: true },
        });
    }
    async remove(id) {
        return this.prisma.buyer.delete({
            where: { id },
            include: { user: true },
        });
    }
    async getBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return Number(user.balance);
    }
    async depositFunds(userId, amount, description = 'Wallet deposit') {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const newBalance = Number(user.balance) + amount;
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    type: 'CREDIT',
                    amount,
                    description,
                    referenceType: 'WALLET_DEPOSIT',
                    referenceId: userId,
                },
            });
            await tx.user.update({
                where: { id: userId },
                data: { balance: newBalance },
            });
            return {
                newBalance,
                transaction,
            };
        });
    }
    async withdrawFunds(userId, amount, description = 'Wallet withdrawal') {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const currentBalance = Number(user.balance);
        if (currentBalance < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const newBalance = currentBalance - amount;
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    type: 'DEBIT',
                    amount,
                    description,
                    referenceType: 'WALLET_WITHDRAWAL',
                    referenceId: userId,
                },
            });
            await tx.user.update({
                where: { id: userId },
                data: { balance: newBalance },
            });
            return {
                newBalance,
                transaction,
            };
        });
    }
    async getTransactionHistory(userId, limit = 20, offset = 0) {
        return this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
};
exports.BuyerService = BuyerService;
exports.BuyerService = BuyerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BuyerService);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuyerController = void 0;
const common_1 = __webpack_require__(2);
const buyer_service_1 = __webpack_require__(32);
const create_buyer_dto_1 = __webpack_require__(34);
const update_buyer_dto_1 = __webpack_require__(35);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let BuyerController = class BuyerController {
    constructor(buyerService) {
        this.buyerService = buyerService;
    }
    async create(req, createBuyerDto) {
        return this.buyerService.create({ ...createBuyerDto, userId: req.user.id });
    }
    async findAll() {
        return this.buyerService.findAll();
    }
    async getBalance(req) {
        const balance = await this.buyerService.getBalance(req.user.id);
        return { balance };
    }
    async depositFunds(req, body) {
        return this.buyerService.depositFunds(req.user.id, body.amount, body.description);
    }
    async withdrawFunds(req, body) {
        return this.buyerService.withdrawFunds(req.user.id, body.amount, body.description);
    }
    async getTransactionHistory(req, limit = '20', offset = '0') {
        const transactions = await this.buyerService.getTransactionHistory(req.user.id, parseInt(limit, 10), parseInt(offset, 10));
        return { transactions };
    }
    async findOne(id) {
        return this.buyerService.findOne(id);
    }
    async update(req, id, updateBuyerDto) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const buyer = await this.buyerService.findOne(id);
            if (!buyer || buyer.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        return this.buyerService.update(id, updateBuyerDto);
    }
    async remove(req, id) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const buyer = await this.buyerService.findOne(id);
            if (!buyer || buyer.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        return this.buyerService.remove(id);
    }
};
exports.BuyerController = BuyerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_buyer_dto_1.CreateBuyerDto !== "undefined" && create_buyer_dto_1.CreateBuyerDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('balance/current'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Post)('deposit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "depositFunds", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "withdrawFunds", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_c = typeof update_buyer_dto_1.UpdateBuyerDto !== "undefined" && update_buyer_dto_1.UpdateBuyerDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "remove", null);
exports.BuyerController = BuyerController = __decorate([
    (0, common_1.Controller)('buyers'),
    __metadata("design:paramtypes", [typeof (_a = typeof buyer_service_1.BuyerService !== "undefined" && buyer_service_1.BuyerService) === "function" ? _a : Object])
], BuyerController);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBuyerDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateBuyerDto {
}
exports.CreateBuyerDto = CreateBuyerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuyerDto.prototype, "userId", void 0);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateBuyerDto = void 0;
const class_validator_1 = __webpack_require__(20);
class UpdateBuyerDto {
}
exports.UpdateBuyerDto = UpdateBuyerDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBuyerDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBuyerDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBuyerDto.prototype, "bio", void 0);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(2);
const admin_service_1 = __webpack_require__(37);
const admin_controller_1 = __webpack_require__(38);
const database_module_1 = __webpack_require__(10);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [admin_service_1.AdminService],
        controllers: [admin_controller_1.AdminController],
    })
], AdminModule);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const totalOrders = await this.prisma.order.count();
        const totalSellers = await this.prisma.seller.count();
        const totalTransactions = await this.prisma.transaction.count();
        return {
            totalUsers,
            totalOrders,
            totalSellers,
            totalTransactions,
        };
    }
    async getUserList(skip = 0, take = 10) {
        return this.prisma.user.findMany({
            skip,
            take,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }
    async approveSeller(adminId, sellerId) {
        const seller = await this.prisma.seller.findUnique({
            where: { id: sellerId },
        });
        if (!seller)
            throw new common_1.NotFoundException('Seller not found');
        const updated = await this.prisma.seller.update({
            where: { id: sellerId },
            data: { kycStatus: 'APPROVED' },
        });
        await this.prisma.adminAudit.create({
            data: {
                adminId,
                action: 'APPROVE_SELLER',
                entityType: 'SELLER',
                entityId: sellerId,
                metadata: { kycStatus: 'APPROVED' },
            },
        });
        return updated;
    }
    async manageBalance(adminId, manageBalanceDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: manageBalanceDto.userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const newBalance = manageBalanceDto.type === 'CREDIT'
            ? Number(user.balance) + manageBalanceDto.amount
            : Number(user.balance) - manageBalanceDto.amount;
        const transaction = await this.prisma.transaction.create({
            data: {
                userId: manageBalanceDto.userId,
                amount: manageBalanceDto.amount,
                type: manageBalanceDto.type,
                description: manageBalanceDto.reason,
                referenceType: 'ADMIN_BALANCE_ADJUSTMENT',
                referenceId: manageBalanceDto.userId,
            },
        });
        await this.prisma.user.update({
            where: { id: manageBalanceDto.userId },
            data: { balance: newBalance },
        });
        await this.prisma.adminAudit.create({
            data: {
                adminId,
                action: 'MANAGE_BALANCE',
                entityType: 'USER',
                entityId: manageBalanceDto.userId,
                metadata: {
                    type: manageBalanceDto.type,
                    amount: manageBalanceDto.amount,
                    reason: manageBalanceDto.reason,
                },
            },
        });
        return transaction;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdminService);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(2);
const admin_service_1 = __webpack_require__(37);
const manage_balance_dto_1 = __webpack_require__(39);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
const roles_guard_1 = __webpack_require__(40);
const roles_decorator_2 = __webpack_require__(30);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() {
        return this.adminService.getStats();
    }
    async getUserList(skip = 0, take = 10) {
        return this.adminService.getUserList(skip, take);
    }
    async approveSeller(req, body) {
        return this.adminService.approveSeller(req.user.id, body.sellerId);
    }
    async manageBalance(req, manageBalanceDto) {
        return this.adminService.manageBalance(req.user.id, manageBalanceDto);
    }
    async updateUserBalance(req, userId, body) {
        const manageBalanceDto = {
            userId,
            type: body.type,
            amount: body.amount,
            reason: body.reason || `Manual balance adjustment: ${body.type}`,
        };
        return this.adminService.manageBalance(req.user.id, manageBalanceDto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserList", null);
__decorate([
    (0, common_1.Post)('approve-seller'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveSeller", null);
__decorate([
    (0, common_1.Post)('manage-balance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof manage_balance_dto_1.ManageBalanceDto !== "undefined" && manage_balance_dto_1.ManageBalanceDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "manageBalance", null);
__decorate([
    (0, common_1.Put)('users/:userId/balance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserBalance", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ManageBalanceDto = void 0;
const class_validator_1 = __webpack_require__(20);
const client_1 = __webpack_require__(12);
class ManageBalanceDto {
}
exports.ManageBalanceDto = ManageBalanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManageBalanceDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ManageBalanceDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TransactionType),
    __metadata("design:type", typeof (_a = typeof client_1.TransactionType !== "undefined" && client_1.TransactionType) === "function" ? _a : Object)
], ManageBalanceDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManageBalanceDto.prototype, "reason", void 0);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RolesGuard_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
let RolesGuard = RolesGuard_1 = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
        this.logger = new common_1.Logger(RolesGuard_1.name);
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride("roles", [
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
            throw new common_1.ForbiddenException("No user found");
        }
        const hasRole = () => requiredRoles.some((role) => user.role === role);
        if (!hasRole()) {
            this.logger.warn("[ROLES-GUARD] User role mismatch - user.role:", user.role, "required:", requiredRoles);
            throw new common_1.ForbiddenException("Insufficient permissions");
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = RolesGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessagingModule = void 0;
const common_1 = __webpack_require__(2);
const messaging_service_1 = __webpack_require__(42);
const messaging_controller_1 = __webpack_require__(45);
const database_module_1 = __webpack_require__(10);
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [messaging_service_1.MessagingService],
        controllers: [messaging_controller_1.MessagingController],
    })
], MessagingModule);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessagingService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const config_1 = __webpack_require__(6);
const crypto_1 = __webpack_require__(43);
let MessagingService = class MessagingService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const rawKey = this.configService.get('MESSAGE_ENCRYPTION_KEY');
        if (!rawKey) {
            throw new Error('MESSAGE_ENCRYPTION_KEY is not configured');
        }
        this.encryptionKey = (0, crypto_1.getEncryptionKey)(rawKey);
    }
    async sendMessage(createMessageDto) {
        return this.prisma.message.create({
            data: {
                senderId: createMessageDto.senderId,
                receiverId: createMessageDto.receiverId,
                content: (0, crypto_1.encryptText)(createMessageDto.content, this.encryptionKey),
            },
        });
    }
    async getConversation(userId, otherUserId) {
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        return messages.map((m) => ({
            ...m,
            content: (0, crypto_1.decryptText)(m.content, this.encryptionKey),
        }));
    }
    async getUserConversations(userId) {
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            include: {
                sender: true,
                receiver: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const conversationMap = new Map();
        messages.forEach((message) => {
            const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, {
                    ...message,
                    content: (0, crypto_1.decryptText)(message.content, this.encryptionKey),
                });
            }
        });
        return Array.from(conversationMap.values());
    }
    async markAsRead(messageId) {
        return this.prisma.message.update({
            where: { id: messageId },
            data: { isRead: true },
        });
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], MessagingService);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decryptText = exports.encryptText = exports.getEncryptionKey = void 0;
const crypto_1 = __importDefault(__webpack_require__(44));
const ALGORITHM = 'aes-256-gcm';
const getEncryptionKey = (rawKey) => {
    if (!rawKey || rawKey.length < 32) {
        throw new Error('MESSAGE_ENCRYPTION_KEY must be at least 32 characters');
    }
    return crypto_1.default.createHash('sha256').update(rawKey).digest();
};
exports.getEncryptionKey = getEncryptionKey;
const encryptText = (plainText, key) => {
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
};
exports.encryptText = encryptText;
const decryptText = (payload, key) => {
    try {
        const [ivB64, tagB64, dataB64] = payload.split(':');
        if (!ivB64 || !tagB64 || !dataB64)
            return payload;
        const iv = Buffer.from(ivB64, 'base64');
        const tag = Buffer.from(tagB64, 'base64');
        const data = Buffer.from(dataB64, 'base64');
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        return decrypted.toString('utf8');
    }
    catch {
        return payload;
    }
};
exports.decryptText = decryptText;


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessagingController = void 0;
const common_1 = __webpack_require__(2);
const messaging_service_1 = __webpack_require__(42);
const create_message_dto_1 = __webpack_require__(46);
const jwt_auth_guard_1 = __webpack_require__(22);
let MessagingController = class MessagingController {
    constructor(messagingService) {
        this.messagingService = messagingService;
    }
    async sendMessage(req, createMessageDto) {
        createMessageDto.senderId = req.user.id;
        return this.messagingService.sendMessage(createMessageDto);
    }
    async getConversations(req) {
        return this.messagingService.getUserConversations(req.user.id);
    }
    async getConversation(req, otherId) {
        return this.messagingService.getConversation(req.user.id, otherId);
    }
    async markAsRead(id) {
        return this.messagingService.markAsRead(id);
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_message_dto_1.CreateMessageDto !== "undefined" && create_message_dto_1.CreateMessageDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversation/:otherId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('otherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markAsRead", null);
exports.MessagingController = MessagingController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof messaging_service_1.MessagingService !== "undefined" && messaging_service_1.MessagingService) === "function" ? _a : Object])
], MessagingController);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMessageDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateMessageDto {
}
exports.CreateMessageDto = CreateMessageDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "receiverId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderModule = void 0;
const common_1 = __webpack_require__(2);
const order_service_1 = __webpack_require__(48);
const order_controller_1 = __webpack_require__(52);
const database_module_1 = __webpack_require__(10);
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService],
    })
], OrderModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrderService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const queue_service_1 = __webpack_require__(49);
let OrderService = OrderService_1 = class OrderService {
    constructor(prismaService, queueService) {
        this.prismaService = prismaService;
        this.queueService = queueService;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    async create(buyerId, createOrderDto) {
        const product = await this.prismaService.product.findUnique({
            where: { id: createOrderDto.productId },
            include: { seller: true },
        });
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.approvalStatus !== "APPROVED") {
            throw new Error("Product is not approved");
        }
        if (product.stock < createOrderDto.quantity) {
            throw new Error("Insufficient stock");
        }
        const totalAmount = Number(product.price) * createOrderDto.quantity;
        const autoFulfill = process.env.AUTO_FULFILL === "true";
        const order = await this.prismaService.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    buyerId,
                    productId: createOrderDto.productId,
                    quantity: createOrderDto.quantity,
                    totalAmount: totalAmount.toString(),
                    paymentIntentId: createOrderDto.paymentIntentId,
                    paymentStatus: "PENDING",
                    status: autoFulfill ? "PROCESSING" : "CONFIRMED",
                },
                include: {
                    product: true,
                    buyer: true,
                },
            });
            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: product.stock - createOrderDto.quantity,
                    deliveryStatus: autoFulfill ? "IN_TRANSIT" : product.deliveryStatus,
                },
            });
            return newOrder;
        });
        try {
            await this.queueService.addOrderConfirmationEmail(order.buyer.email, order.id, order.product.name, order.quantity, Number(order.totalAmount));
            this.logger.log(`Order confirmation email queued for order ${order.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to queue order confirmation email: ${error.message}`);
        }
        try {
            const status = autoFulfill ? "PROCESSING" : "CONFIRMED";
            await this.queueService.addOrderStatusNotification(buyerId, order.id, status);
            this.logger.log(`Order status notification queued for order ${order.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to queue order notification: ${error.message}`);
        }
        return order;
    }
    async findAll(filters) {
        return this.prismaService.order.findMany({
            where: filters,
            include: {
                product: true,
                buyer: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id) {
        return this.prismaService.order.findUnique({
            where: { id },
            include: {
                product: {
                    include: {
                        seller: true,
                    },
                },
                buyer: true,
                ecoImpacts: true,
            },
        });
    }
    async update(id, data) {
        return this.prismaService.order.update({
            where: { id },
            data,
            include: {
                product: true,
                buyer: true,
            },
        });
    }
    async remove(id) {
        return this.prismaService.order.delete({
            where: { id },
        });
    }
    async findByBuyer(buyerId) {
        return this.prismaService.order.findMany({
            where: { buyerId },
            include: {
                product: {
                    include: {
                        seller: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findByStatus(status) {
        return this.prismaService.order.findMany({
            where: { status },
            include: {
                product: true,
                buyer: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async cancelOrder(orderId, userId) {
        const order = await this.prismaService.order.findUnique({
            where: { id: orderId },
            include: {
                product: true,
                buyer: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException("Order not found");
        }
        if (order.buyerId !== userId) {
            throw new common_1.BadRequestException("Not authorized to cancel this order");
        }
        if (!["PENDING", "CONFIRMED"].includes(order.status)) {
            throw new common_1.BadRequestException(`Cannot cancel order with status ${order.status}.`);
        }
        const updatedOrder = await this.prismaService.$transaction(async (tx) => {
            const cancelled = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: "CANCELLED",
                    updatedAt: new Date(),
                },
                include: {
                    product: true,
                    buyer: true,
                },
            });
            await tx.product.update({
                where: { id: order.productId },
                data: {
                    stock: order.product.stock + order.quantity,
                },
            });
            const refundAmount = Number(order.totalAmount);
            await tx.transaction.create({
                data: {
                    userId: order.buyerId,
                    type: "CREDIT",
                    amount: refundAmount,
                    description: `Refund for cancelled order ${orderId}`,
                    referenceType: "ORDER_CANCELLATION",
                    referenceId: orderId,
                },
            });
            const buyerUser = await tx.user.findUnique({
                where: { id: order.buyerId },
                select: { balance: true },
            });
            if (buyerUser) {
                await tx.user.update({
                    where: { id: order.buyerId },
                    data: {
                        balance: Number(buyerUser.balance) + refundAmount,
                    },
                });
            }
            return cancelled;
        });
        try {
            await this.queueService.addRefundEmail(order.buyer.email, orderId, Number(order.totalAmount));
            this.logger.log(`Refund email queued for cancelled order ${orderId}`);
        }
        catch (error) {
            this.logger.error(`Failed to queue refund email: ${error.message}`);
        }
        return updatedOrder;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _b : Object])
], OrderService);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueService = void 0;
const common_1 = __webpack_require__(2);
const bull_1 = __webpack_require__(50);
const bull_2 = __webpack_require__(51);
let QueueService = class QueueService {
    constructor(emailQueue, notificationQueue) {
        this.emailQueue = emailQueue;
        this.notificationQueue = notificationQueue;
    }
    async addEmailJob(data, options) {
        return this.emailQueue.add(data, { ...options });
    }
    async addOrderConfirmationEmail(to, orderId, productName, quantity, totalAmount) {
        const data = {
            to,
            subject: "Order Confirmation - EARTHLYN",
            template: "order-confirmation",
            context: { orderId, productName, quantity, totalAmount, orderDate: new Date().toISOString() }
        };
        return this.addEmailJob(data);
    }
    async addDisputeNotificationEmail(to, disputeId, reason, orderId) {
        const data = {
            to,
            subject: "Dispute Notification - EARTHLYN",
            template: "dispute-notification",
            context: { disputeId, reason, orderId, createdAt: new Date().toISOString() }
        };
        return this.addEmailJob(data);
    }
    async addWelcomeEmail(to, userName) {
        const data = {
            to,
            subject: "Welcome to EARTHLYN",
            template: "welcome",
            context: { userName, joinDate: new Date().toISOString() }
        };
        return this.addEmailJob(data);
    }
    async addPaymentConfirmationEmail(to, transactionId, amount, paymentMethod) {
        const data = {
            to,
            subject: "Payment Confirmation - EARTHLYN",
            template: "payment-confirmation",
            context: { transactionId, amount, paymentMethod, date: new Date().toISOString() }
        };
        return this.addEmailJob(data);
    }
    async addRefundEmail(to, orderId, refundAmount) {
        const data = {
            to,
            subject: "Refund Processed - EARTHLYN",
            template: "refund-confirmation",
            context: { orderId, refundAmount, processedDate: new Date().toISOString() }
        };
        return this.addEmailJob(data);
    }
    async addNotificationJob(data, options) {
        return this.notificationQueue.add(data, { ...options });
    }
    async addOrderStatusNotification(userId, orderId, status, deviceTokens) {
        const data = {
            userId,
            title: "Order Update",
            body: this.getStatusMessage(status),
            type: "ORDER",
            deviceTokens,
            data: { orderId, status, notificationType: "ORDER_UPDATE" }
        };
        return this.addNotificationJob(data);
    }
    async addMessageNotification(userId, senderId, senderName, messagePreview, deviceTokens) {
        const data = {
            userId,
            title: `New message from ${senderName}`,
            body: messagePreview,
            type: "MESSAGE",
            deviceTokens,
            data: { senderId, notificationType: "NEW_MESSAGE" }
        };
        return this.addNotificationJob(data);
    }
    async addDisputeNotification(userId, disputeId, reason, deviceTokens) {
        const data = {
            userId,
            title: "Dispute Notification",
            body: `A dispute has been raised: ${reason}`,
            type: "ALERT",
            deviceTokens,
            data: { disputeId, reason, notificationType: "DISPUTE_ALERT" }
        };
        return this.addNotificationJob(data);
    }
    async addPaymentNotification(userId, transactionId, amount, status, deviceTokens) {
        const data = {
            userId,
            title: "Payment Update",
            body: `Payment of $${amount} was ${status.toLowerCase()}`,
            type: "ALERT",
            deviceTokens,
            data: { transactionId, amount, status, notificationType: "PAYMENT_UPDATE" }
        };
        return this.addNotificationJob(data);
    }
    async addPromotionalNotification(userId, title, message, promotionId, deviceTokens) {
        const data = {
            userId,
            title,
            body: message,
            type: "PROMOTION",
            deviceTokens,
            data: { promotionId, notificationType: "PROMOTION" }
        };
        return this.addNotificationJob(data);
    }
    getStatusMessage(status) {
        const messages = {
            CONFIRMED: "Your order has been confirmed!",
            PROCESSING: "Your order is being processed",
            IN_TRANSIT: "Your order is on the way!",
            DELIVERED: "Your order has been delivered",
            CANCELLED: "Your order has been cancelled"
        };
        return messages[status] || `Order status: ${status}`;
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)("email")),
    __param(1, (0, bull_1.InjectQueue)("notifications")),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _a : Object, typeof (_b = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _b : Object])
], QueueService);


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("@nestjs/bull");

/***/ }),
/* 51 */
/***/ ((module) => {

module.exports = require("bull");

/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderController = void 0;
const common_1 = __webpack_require__(2);
const order_service_1 = __webpack_require__(48);
const create_order_dto_1 = __webpack_require__(53);
const client_1 = __webpack_require__(12);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
const roles_decorator_2 = __webpack_require__(30);
const common_2 = __webpack_require__(2);
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(req, createOrderDto) {
        return this.orderService.create(req.user.id, createOrderDto);
    }
    findAll(buyerId, status) {
        return this.orderService.findAll({ buyerId, status });
    }
    findByBuyer(req, buyerId) {
        if (req.user.role === roles_decorator_2.UserRole.BUYER && req.user.id !== buyerId) {
            throw new common_2.ForbiddenException('Cannot access other buyer orders');
        }
        return this.orderService.findByBuyer(buyerId);
    }
    findByStatus(status) {
        return this.orderService.findByStatus(status);
    }
    async cancelOrder(req, orderId) {
        return this.orderService.cancelOrder(orderId, req.user.id);
    }
    async findOne(req, id) {
        const order = await this.orderService.findOne(id);
        if (req.user.role === roles_decorator_2.UserRole.BUYER && order?.buyerId !== req.user.id) {
            throw new common_2.ForbiddenException('Not authorized to view this order');
        }
        if (req.user.role === roles_decorator_2.UserRole.SELLER) {
            const sellerUserId = order?.product?.seller?.userId;
            if (!sellerUserId || sellerUserId !== req.user.id) {
                throw new common_2.ForbiddenException('Not authorized to view this order');
            }
        }
        return order;
    }
    async update(req, id, data) {
        if (req.user.role === roles_decorator_2.UserRole.SELLER) {
            const order = await this.orderService.findOne(id);
            const sellerUserId = order?.product?.seller?.userId;
            if (!sellerUserId || sellerUserId !== req.user.id) {
                throw new common_2.ForbiddenException('Not authorized to update this order');
            }
        }
        return this.orderService.update(id, data);
    }
    remove(id) {
        return this.orderService.remove(id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.BUYER, roles_decorator_2.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_order_dto_1.CreateOrderDto !== "undefined" && create_order_dto_1.CreateOrderDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.CUSTOMER_SERVICE),
    __param(0, (0, common_1.Query)('buyerId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('buyer/:buyerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.BUYER, roles_decorator_2.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findByBuyer", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.CUSTOMER_SERVICE),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.BUYER, roles_decorator_2.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.BUYER, roles_decorator_2.UserRole.SELLER, roles_decorator_2.UserRole.CUSTOMER_SERVICE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.SELLER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "remove", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [typeof (_a = typeof order_service_1.OrderService !== "undefined" && order_service_1.OrderService) === "function" ? _a : Object])
], OrderController);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateOrderDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentIntentId", void 0);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentModule = void 0;
const common_1 = __webpack_require__(2);
const payment_service_1 = __webpack_require__(55);
const payment_controller_1 = __webpack_require__(57);
const database_module_1 = __webpack_require__(10);
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [payment_service_1.PaymentService],
        controllers: [payment_controller_1.PaymentController],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(6);
const prisma_service_1 = __webpack_require__(11);
const stripe_1 = __importDefault(__webpack_require__(56));
let PaymentService = class PaymentService {
    constructor(configService, prismaService) {
        this.configService = configService;
        this.prismaService = prismaService;
        const apiKey = this.configService.get("STRIPE_SECRET_KEY");
        if (!apiKey) {
            throw new Error("STRIPE_SECRET_KEY is not configured");
        }
        this.stripe = new stripe_1.default(apiKey, {
            timeout: 90000,
        });
    }
    async createPaymentIntent(createPaymentIntentDto, userId) {
        try {
            const { amount, items, shippingAddress, orderId } = createPaymentIntentDto;
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: "usd",
                payment_method_types: ["card"],
                metadata: {
                    userId,
                    itemCount: items.length,
                    products: JSON.stringify(items),
                    shippingAddress: JSON.stringify(shippingAddress),
                    orderId: orderId || '',
                },
                description: `Order from user ${userId} with ${items.length} item(s)`,
            });
            if (orderId) {
                await this.upsertPaymentRecord(orderId, paymentIntent.id, amount, 'PENDING');
            }
            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
            };
        }
        catch (error) {
            console.error(`Stripe error: ${error.message}`);
            throw new Error(`Failed to create payment intent: ${error.message}`);
        }
    }
    async confirmPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            const orderId = paymentIntent.metadata?.orderId;
            if (orderId) {
                await this.prismaUpdateOrderPayment(orderId, 'SUCCEEDED', paymentIntentId);
                await this.upsertPaymentRecord(orderId, paymentIntentId, paymentIntent.amount / 100, 'SUCCEEDED');
            }
            return {
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
                paymentIntentId: paymentIntent.id,
            };
        }
        catch (error) {
            console.error(`Stripe confirmation error: ${error.message}`);
            throw new Error(`Failed to confirm payment: ${error.message}`);
        }
    }
    async refundPayment(paymentIntentId, amount) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined,
            });
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            const orderId = paymentIntent.metadata?.orderId;
            if (orderId) {
                await this.prismaUpdateOrderPayment(orderId, 'REFUNDED', paymentIntentId);
                await this.upsertPaymentRecord(orderId, paymentIntentId, paymentIntent.amount / 100, 'REFUNDED');
            }
            return {
                refundId: refund.id,
                status: refund.status,
                amount: refund.amount / 100,
            };
        }
        catch (error) {
            console.error(`Refund error: ${error.message}`);
            throw new Error(`Refund failed: ${error.message}`);
        }
    }
    async getPaymentIntentStatus(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                status: paymentIntent.status,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount / 100,
            };
        }
        catch (error) {
            console.error(`Status check error: ${error.message}`);
            throw new Error(`Failed to get payment status: ${error.message}`);
        }
    }
    async handleWebhook(rawBody, signature) {
        const secret = this.configService.get("STRIPE_WEBHOOK_SECRET");
        if (!secret) {
            throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
        }
        const sig = Array.isArray(signature) ? signature[0] : signature;
        const event = this.stripe.webhooks.constructEvent(rawBody, sig, secret);
        switch (event.type) {
            case "payment_intent.succeeded": {
                const intent = event.data.object;
                const orderId = intent.metadata?.orderId;
                if (orderId) {
                    await this.prismaUpdateOrderPayment(orderId, "SUCCEEDED", intent.id);
                    await this.upsertPaymentRecord(orderId, intent.id, intent.amount / 100, "SUCCEEDED");
                }
                break;
            }
            case "payment_intent.payment_failed": {
                const intent = event.data.object;
                const orderId = intent.metadata?.orderId;
                if (orderId) {
                    await this.prismaUpdateOrderPayment(orderId, "FAILED", intent.id);
                    await this.upsertPaymentRecord(orderId, intent.id, intent.amount / 100, "FAILED");
                }
                break;
            }
            case "charge.refunded": {
                const charge = event.data.object;
                const intentId = charge.payment_intent?.toString();
                if (intentId) {
                    const paymentIntent = await this.stripe.paymentIntents.retrieve(intentId);
                    const orderId = paymentIntent.metadata?.orderId;
                    if (orderId) {
                        await this.prismaUpdateOrderPayment(orderId, "REFUNDED", paymentIntent.id);
                        await this.upsertPaymentRecord(orderId, paymentIntent.id, paymentIntent.amount / 100, "REFUNDED");
                    }
                }
                break;
            }
            default:
                break;
        }
        return { received: true };
    }
    async prismaUpdateOrderPayment(orderId, status, paymentIntentId) {
        try {
            await this.prismaService.order.update({
                where: { id: orderId },
                data: { paymentStatus: status, paymentIntentId },
            });
        }
        catch {
        }
    }
    async upsertPaymentRecord(orderId, stripeIntentId, amount, status) {
        try {
            const existing = await this.prismaService.payment.findFirst({
                where: { orderId },
            });
            if (existing) {
                await this.prismaService.payment.update({
                    where: { id: existing.id },
                    data: { status, stripeIntentId, amount },
                });
                return;
            }
            await this.prismaService.payment.create({
                data: {
                    orderId,
                    stripeIntentId,
                    amount,
                    status,
                },
            });
        }
        catch {
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], PaymentService);


/***/ }),
/* 56 */
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentController = void 0;
const common_1 = __webpack_require__(2);
const payment_service_1 = __webpack_require__(55);
const create_payment_intent_dto_1 = __webpack_require__(58);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPaymentIntent(req, createPaymentIntentDto) {
        return await this.paymentService.createPaymentIntent(createPaymentIntentDto, req.user.id);
    }
    async getPaymentStatus(paymentIntentId) {
        return await this.paymentService.getPaymentIntentStatus(paymentIntentId);
    }
    async confirmPayment(paymentIntentId) {
        return await this.paymentService.confirmPaymentIntent(paymentIntentId);
    }
    async refundPayment(paymentIntentId, amount) {
        return await this.paymentService.refundPayment(paymentIntentId, amount);
    }
    async webhook(req) {
        const signature = req.headers["stripe-signature"];
        return this.paymentService.handleWebhook(req.rawBody, signature);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)("create-intent"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_payment_intent_dto_1.CreatePaymentIntentDto !== "undefined" && create_payment_intent_dto_1.CreatePaymentIntentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Get)(":paymentIntentId/status"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Post)(":paymentIntentId/confirm"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)(":paymentIntentId/refund"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __param(1, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundPayment", null);
__decorate([
    (0, common_1.Post)("webhook"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "webhook", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [typeof (_a = typeof payment_service_1.PaymentService !== "undefined" && payment_service_1.PaymentService) === "function" ? _a : Object])
], PaymentController);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePaymentIntentDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreatePaymentIntentDto {
}
exports.CreatePaymentIntentDto = CreatePaymentIntentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreatePaymentIntentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePaymentIntentDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePaymentIntentDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentIntentDto.prototype, "orderId", void 0);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const file_upload_service_1 = __webpack_require__(60);
const common_1 = __webpack_require__(2);
const product_service_1 = __webpack_require__(63);
const product_controller_1 = __webpack_require__(64);
const database_module_1 = __webpack_require__(10);
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [product_service_1.ProductService, file_upload_service_1.FileUploadService],
        controllers: [product_controller_1.ProductController],
    })
], ProductModule);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUploadService = void 0;
const common_1 = __webpack_require__(2);
const fs_1 = __webpack_require__(61);
const path = __importStar(__webpack_require__(62));
const crypto = __importStar(__webpack_require__(44));
let FileUploadService = class FileUploadService {
    constructor() {
        this.uploadDir = path.join(process.cwd(), "public", "uploads");
    }
    async onModuleInit() {
        try {
            await fs_1.promises.mkdir(this.uploadDir, { recursive: true });
        }
        catch (error) {
            console.error("Failed to create upload directory:", error);
        }
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException("No file provided");
        }
        if (!file.mimetype.startsWith("image/")) {
            throw new common_1.BadRequestException("Only image files are allowed");
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException("File size exceeds 5MB limit");
        }
        try {
            const fileName = crypto.randomBytes(16).toString("hex") + "_" + Date.now();
            const filePath = path.join(this.uploadDir, fileName);
            await fs_1.promises.writeFile(filePath, file.buffer);
            return "/uploads/" + fileName;
        }
        catch (error) {
            throw new common_1.BadRequestException("File upload failed");
        }
    }
    async uploadVideo(file) {
        if (!file) {
            throw new common_1.BadRequestException("No file provided");
        }
        if (!file.mimetype.startsWith("video/")) {
            throw new common_1.BadRequestException("Only video files are allowed");
        }
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException("File size exceeds 100MB limit");
        }
        try {
            const fileName = crypto.randomBytes(16).toString("hex") + "_" + Date.now();
            const filePath = path.join(this.uploadDir, fileName);
            await fs_1.promises.writeFile(filePath, file.buffer);
            return "/uploads/" + fileName;
        }
        catch (error) {
            throw new common_1.BadRequestException("File upload failed");
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)()
], FileUploadService);


/***/ }),
/* 61 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 62 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(6);
const prisma_service_1 = __webpack_require__(11);
let ProductService = class ProductService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async create(data) {
        const sellerLookup = data.sellerId
            ? { id: data.sellerId }
            : { userId: data.sellerUserId };
        const seller = await this.prisma.seller.findUnique({
            where: sellerLookup,
            select: { id: true, userId: true, kycStatus: true, tier: true, isVerified: true },
        });
        if (!seller)
            throw new common_1.NotFoundException('Seller not found');
        if (seller.kycStatus !== 'APPROVED') {
            throw new common_1.BadRequestException('Seller KYC not approved');
        }
        const autoApprove = seller.isVerified || ['BLOOM', 'EVERGREEN', 'EARTH_GUARDIAN'].includes(seller.tier);
        const processingFeeRate = this.configService.get('commerce.processingFeeRate') ?? 0.05;
        const computedFee = Number(data.price || 0) * processingFeeRate;
        const processingFee = Number(data.processingFee ?? computedFee);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: seller.userId },
                select: { balance: true },
            });
            if (!user)
                throw new common_1.NotFoundException('Seller user not found');
            if (Number(user.balance) < processingFee) {
                throw new common_1.BadRequestException('Insufficient balance for processing fee');
            }
            const product = await tx.product.create({
                data: {
                    name: data.name,
                    price: data.price,
                    stock: data.stock,
                    sellerId: seller.id,
                    description: data.description || '',
                    ecoScore: data.ecoScore || 0,
                    category: data.category || 'other',
                    processingFee,
                    approvalStatus: autoApprove ? 'APPROVED' : 'PENDING',
                    approvedAt: autoApprove ? new Date() : null,
                },
                include: { seller: true },
            });
            await tx.transaction.create({
                data: {
                    userId: seller.userId,
                    amount: processingFee,
                    type: 'DEBIT',
                    description: `Processing fee for product ${product.id}`,
                    referenceType: 'PRODUCT_LISTING_FEE',
                    referenceId: product.id,
                },
            });
            await tx.user.update({
                where: { id: seller.userId },
                data: { balance: Number(user.balance) - processingFee },
            });
            return product;
        });
    }
    async findAll(filters) {
        return this.prisma.product.findMany({
            where: filters || {},
            include: { seller: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { seller: true },
        });
    }
    async update(id, data) {
        return this.prisma.product.update({ where: { id }, data, include: { seller: true } });
    }
    async delete(id) {
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], ProductService);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductController = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(65);
const product_service_1 = __webpack_require__(63);
const file_upload_service_1 = __webpack_require__(60);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let ProductController = class ProductController {
    constructor(productService, fileUploadService) {
        this.productService = productService;
        this.fileUploadService = fileUploadService;
    }
    async findAll() {
        return this.productService.findAll();
    }
    async findOne(id) {
        const product = await this.productService.findOne(id);
        return { product };
    }
    async create(body, req) {
        const payload = { ...body };
        if (req.user.role === roles_decorator_1.UserRole.ADMIN && body.sellerId) {
            payload.sellerId = body.sellerId;
        }
        else {
            payload.sellerUserId = req.user.id;
        }
        return this.productService.create(payload);
    }
    async uploadImage(id, file, req) {
        const product = await this.productService.findOne(id);
        if (!product) {
            throw new common_1.ForbiddenException('Product not found');
        }
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN && product.seller?.userId !== req.user.id) {
            throw new common_1.ForbiddenException('Not authorized to upload image for this product');
        }
        const imageUrl = await this.fileUploadService.uploadImage(file);
        const updated = await this.productService.update(id, { imageUrl });
        return { imageUrl, product: updated };
    }
    async update(req, id, body) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const product = await this.productService.findOne(id);
            if (!product || product.seller?.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        return this.productService.update(id, body);
    }
    async delete(req, id) {
        if (req.user.role !== roles_decorator_1.UserRole.ADMIN) {
            const product = await this.productService.findOne(id);
            if (!product || product.seller?.userId !== req.user.id) {
                throw new common_1.ForbiddenException('Not authorized');
            }
        }
        return this.productService.delete(id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/upload-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "delete", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _a : Object, typeof (_b = typeof file_upload_service_1.FileUploadService !== "undefined" && file_upload_service_1.FileUploadService) === "function" ? _b : Object])
], ProductController);


/***/ }),
/* 65 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductApprovalModule = void 0;
const common_1 = __webpack_require__(2);
const product_approval_service_1 = __webpack_require__(67);
const product_approval_controller_1 = __webpack_require__(68);
const database_module_1 = __webpack_require__(10);
let ProductApprovalModule = class ProductApprovalModule {
};
exports.ProductApprovalModule = ProductApprovalModule;
exports.ProductApprovalModule = ProductApprovalModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [product_approval_service_1.ProductApprovalService],
        controllers: [product_approval_controller_1.ProductApprovalController],
    })
], ProductApprovalModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductApprovalService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let ProductApprovalService = class ProductApprovalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPendingProducts(skip = 0, take = 10) {
        return await this.prisma.product.findMany({
            where: { approvalStatus: "PENDING" },
            include: { seller: true },
            skip,
            take,
        });
    }
    async getApprovedProducts(skip = 0, take = 10) {
        return await this.prisma.product.findMany({
            where: { approvalStatus: "APPROVED" },
            include: { seller: true },
            skip,
            take,
        });
    }
    async getRejectedProducts(skip = 0, take = 10) {
        return await this.prisma.product.findMany({
            where: { approvalStatus: "REJECTED" },
            include: { seller: true },
            skip,
            take,
        });
    }
    async approveProduct(productId) {
        return await this.prisma.product.update({
            where: { id: productId },
            data: { approvalStatus: "APPROVED", approvedAt: new Date() },
        });
    }
    async rejectProduct(productId, reason) {
        return await this.prisma.product.update({
            where: { id: productId },
            data: { approvalStatus: "REJECTED" },
        });
    }
    async getProductStats() {
        return {
            pending: await this.prisma.product.count({ where: { approvalStatus: "PENDING" } }),
            approved: await this.prisma.product.count({ where: { approvalStatus: "APPROVED" } }),
            rejected: await this.prisma.product.count({ where: { approvalStatus: "REJECTED" } }),
            total: await this.prisma.product.count(),
        };
    }
};
exports.ProductApprovalService = ProductApprovalService;
exports.ProductApprovalService = ProductApprovalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProductApprovalService);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductApprovalController = void 0;
const common_1 = __webpack_require__(2);
const product_approval_service_1 = __webpack_require__(67);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let ProductApprovalController = class ProductApprovalController {
    constructor(service) {
        this.service = service;
    }
    async getPending(skip, take) {
        return this.service.getPendingProducts(parseInt(skip || '0'), parseInt(take || '10'));
    }
    async getApproved(skip, take) {
        return this.service.getApprovedProducts(parseInt(skip || '0'), parseInt(take || '10'));
    }
    async getRejected(skip, take) {
        return this.service.getRejectedProducts(parseInt(skip || '0'), parseInt(take || '10'));
    }
    async getStats() {
        return this.service.getProductStats();
    }
    async approve(productId) {
        return this.service.approveProduct(productId);
    }
    async reject(productId) {
        return this.service.rejectProduct(productId);
    }
};
exports.ProductApprovalController = ProductApprovalController;
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductApprovalController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('approved'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductApprovalController.prototype, "getApproved", null);
__decorate([
    (0, common_1.Get)('rejected'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductApprovalController.prototype, "getRejected", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductApprovalController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':productId/approve'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductApprovalController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':productId/reject'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductApprovalController.prototype, "reject", null);
exports.ProductApprovalController = ProductApprovalController = __decorate([
    (0, common_1.Controller)('admin/product-approval'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof product_approval_service_1.ProductApprovalService !== "undefined" && product_approval_service_1.ProductApprovalService) === "function" ? _a : Object])
], ProductApprovalController);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerKycModule = void 0;
const common_1 = __webpack_require__(2);
const seller_kyc_service_1 = __webpack_require__(70);
const seller_kyc_controller_1 = __webpack_require__(71);
const database_module_1 = __webpack_require__(10);
let SellerKycModule = class SellerKycModule {
};
exports.SellerKycModule = SellerKycModule;
exports.SellerKycModule = SellerKycModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [seller_kyc_service_1.SellerKycService],
        controllers: [seller_kyc_controller_1.SellerKycController, seller_kyc_controller_1.KycAdminController],
    })
], SellerKycModule);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerKycService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let SellerKycService = class SellerKycService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitKycDocuments(userId, dto) {
        const seller = await this.prisma.seller.findUnique({
            where: { userId },
        });
        if (!seller)
            throw new Error('Seller not found');
        await this.prisma.$transaction(async (tx) => {
            for (const doc of dto.documents) {
                await tx.sellerKycDocument.create({
                    data: {
                        sellerId: seller.id,
                        docType: doc.docType,
                        url: doc.url,
                        status: 'PENDING',
                    },
                });
            }
            await tx.seller.update({
                where: { id: seller.id },
                data: { kycStatus: "PENDING" },
            });
        });
        return { submitted: true, count: dto.documents.length };
    }
    async getKycStatus(userId) {
        return await this.prisma.seller.findUnique({
            where: { userId },
            select: { kycStatus: true, isVerified: true },
        });
    }
    async getPendingKycRequests() {
        return await this.prisma.seller.findMany({
            where: { kycStatus: "PENDING" },
            include: { user: true },
        });
    }
    async approveKyc(sellerId) {
        return await this.prisma.seller.update({
            where: { id: sellerId },
            data: { kycStatus: "APPROVED", isVerified: true },
        });
    }
    async rejectKyc(sellerId, reason) {
        return await this.prisma.seller.update({
            where: { id: sellerId },
            data: { kycStatus: "REJECTED", isVerified: false },
        });
    }
};
exports.SellerKycService = SellerKycService;
exports.SellerKycService = SellerKycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SellerKycService);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KycAdminController = exports.SellerKycController = void 0;
const common_1 = __webpack_require__(2);
const seller_kyc_service_1 = __webpack_require__(70);
const jwt_auth_guard_1 = __webpack_require__(22);
const current_user_decorator_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(30);
const submit_kyc_dto_1 = __webpack_require__(72);
let SellerKycController = class SellerKycController {
    constructor(service) {
        this.service = service;
    }
    async submitDocuments(user, dto) {
        return this.service.submitKycDocuments(user.id, dto);
    }
    async getStatus(user) {
        return this.service.getKycStatus(user.id);
    }
};
exports.SellerKycController = SellerKycController;
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof submit_kyc_dto_1.SubmitKycDto !== "undefined" && submit_kyc_dto_1.SubmitKycDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SellerKycController.prototype, "submitDocuments", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellerKycController.prototype, "getStatus", null);
exports.SellerKycController = SellerKycController = __decorate([
    (0, common_1.Controller)('seller/kyc'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof seller_kyc_service_1.SellerKycService !== "undefined" && seller_kyc_service_1.SellerKycService) === "function" ? _a : Object])
], SellerKycController);
let KycAdminController = class KycAdminController {
    constructor(service) {
        this.service = service;
    }
    async getPending() {
        return this.service.getPendingKycRequests();
    }
    async approve(sellerId) {
        return this.service.approveKyc(sellerId);
    }
    async reject(sellerId) {
        return this.service.rejectKyc(sellerId);
    }
};
exports.KycAdminController = KycAdminController;
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KycAdminController.prototype, "getPending", null);
__decorate([
    (0, common_1.Post)(':sellerId/approve'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycAdminController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':sellerId/reject'),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycAdminController.prototype, "reject", null);
exports.KycAdminController = KycAdminController = __decorate([
    (0, common_1.Controller)('admin/kyc'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_c = typeof seller_kyc_service_1.SellerKycService !== "undefined" && seller_kyc_service_1.SellerKycService) === "function" ? _c : Object])
], KycAdminController);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubmitKycDto = void 0;
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(73);
class KycDocumentDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KycDocumentDto.prototype, "docType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KycDocumentDto.prototype, "url", void 0);
class SubmitKycDto {
}
exports.SubmitKycDto = SubmitKycDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => KycDocumentDto),
    __metadata("design:type", Array)
], SubmitKycDto.prototype, "documents", void 0);


/***/ }),
/* 73 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeliveryManagementModule = void 0;
const common_1 = __webpack_require__(2);
const delivery_management_service_1 = __webpack_require__(75);
const delivery_management_controller_1 = __webpack_require__(76);
const database_module_1 = __webpack_require__(10);
let DeliveryManagementModule = class DeliveryManagementModule {
};
exports.DeliveryManagementModule = DeliveryManagementModule;
exports.DeliveryManagementModule = DeliveryManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [delivery_management_service_1.DeliveryManagementService],
        controllers: [delivery_management_controller_1.DeliveryManagementController],
    })
], DeliveryManagementModule);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeliveryManagementService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const config_1 = __webpack_require__(6);
let DeliveryManagementService = class DeliveryManagementService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    getTierRate(tier) {
        switch (tier) {
            case 'EARTH_GUARDIAN':
                return 0.3;
            case 'EVERGREEN':
                return 0.25;
            case 'BLOOM':
                return 0.2;
            case 'GROWTH':
                return 0.15;
            case 'SPROUT':
                return 0.1;
            case 'SEED':
            default:
                return 0.07;
        }
    }
    calculateTier(totalSales) {
        if (totalSales >= 50000)
            return 'EARTH_GUARDIAN';
        if (totalSales >= 25000)
            return 'EVERGREEN';
        if (totalSales >= 10000)
            return 'BLOOM';
        if (totalSales >= 5000)
            return 'GROWTH';
        if (totalSales >= 1000)
            return 'SPROUT';
        return 'SEED';
    }
    calculateRewardPoints(totalAmount) {
        return Math.floor(totalAmount * 0.05);
    }
    async getOrdersByStatus(userId, status) {
        const where = { product: { seller: { userId } } };
        if (status) {
            where.product = { ...where.product, deliveryStatus: status };
        }
        return await this.prisma.order.findMany({
            where,
            include: { product: true, buyer: { select: { id: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateDeliveryStatus(orderId, status, trackingId, sellerUserId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                product: { include: { seller: true } },
                buyer: true,
            },
        });
        if (!order || !order.product)
            throw new Error('Order not found');
        if (sellerUserId && order.product.seller?.userId !== sellerUserId) {
            throw new common_1.BadRequestException('Not authorized for this order');
        }
        if (status === 'DELIVERED' && order.status === 'DELIVERED') {
            return order;
        }
        return this.prisma.$transaction(async (tx) => {
            const orderStatus = status === 'DELIVERED'
                ? 'DELIVERED'
                : status === 'IN_TRANSIT'
                    ? 'SHIPPED'
                    : status === 'FAILED'
                        ? 'CANCELLED'
                        : 'PROCESSING';
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: orderStatus,
                    deliveryTrackingId: trackingId || order.product.id,
                    deliveredAt: status === 'DELIVERED' ? new Date() : null,
                },
            });
            await tx.product.update({
                where: { id: order.product.id },
                data: { deliveryStatus: status, updatedAt: new Date() },
            });
            if (status !== 'DELIVERED') {
                return updatedOrder;
            }
            if (order.paymentStatus !== 'SUCCEEDED') {
                throw new common_1.BadRequestException('Payment not completed');
            }
            const seller = await tx.seller.findUnique({
                where: { id: order.product.sellerId },
            });
            if (!seller)
                throw new Error('Seller not found');
            const existingCredit = await tx.transaction.findFirst({
                where: {
                    referenceType: 'ORDER_DELIVERY',
                    referenceId: order.id,
                    userId: seller.userId,
                },
            });
            if (existingCredit)
                return updatedOrder;
            const tierRate = this.getTierRate(seller.tier);
            const totalAmount = Number(order.totalAmount);
            const profitAmount = Number((totalAmount * tierRate).toFixed(2));
            await tx.transaction.create({
                data: {
                    userId: seller.userId,
                    amount: profitAmount,
                    type: 'CREDIT',
                    description: `Profit credit for order ${order.id}`,
                    referenceType: 'ORDER_DELIVERY',
                    referenceId: order.id,
                },
            });
            const sellerUser = await tx.user.findUnique({
                where: { id: seller.userId },
                select: { balance: true },
            });
            if (!sellerUser)
                throw new Error('Seller user not found');
            await tx.user.update({
                where: { id: seller.userId },
                data: { balance: Number(sellerUser.balance) + profitAmount },
            });
            const newTotalSales = Number(seller.totalSales) + totalAmount;
            const newTier = this.calculateTier(newTotalSales);
            await tx.seller.update({
                where: { id: seller.id },
                data: { totalSales: newTotalSales, tier: newTier },
            });
            const ecoPointsPerDollar = this.configService.get('commerce.ecoPointsPerDollar') ?? 1;
            const ecoPoints = Math.floor(totalAmount * ecoPointsPerDollar * (1 + (order.product.ecoScore || 0) / 100));
            const existingEco = await tx.ecoImpact.findFirst({
                where: { orderId: order.id },
            });
            if (!existingEco) {
                await tx.ecoImpact.create({
                    data: {
                        userId: order.buyerId,
                        productId: order.productId,
                        orderId: order.id,
                        pointsEarned: ecoPoints,
                        impact: `Earned ${ecoPoints} eco points for order ${order.id}`,
                    },
                });
                const buyerUser = await tx.user.findUnique({
                    where: { id: order.buyerId },
                    select: { ecoPoints: true },
                });
                if (!buyerUser)
                    throw new common_1.BadRequestException('Buyer not found');
                await tx.user.update({
                    where: { id: order.buyerId },
                    data: { ecoPoints: buyerUser.ecoPoints + ecoPoints },
                });
            }
            const rewardPoints = this.calculateRewardPoints(totalAmount);
            const existingReward = await tx.transaction.findFirst({
                where: {
                    referenceType: 'ORDER_REWARD_POINTS',
                    referenceId: order.id,
                    userId: order.buyerId,
                },
            });
            if (!existingReward) {
                await tx.transaction.create({
                    data: {
                        userId: order.buyerId,
                        amount: rewardPoints,
                        type: 'CREDIT',
                        description: `Reward points (5% of order value) for order ${order.id}`,
                        referenceType: 'ORDER_REWARD_POINTS',
                        referenceId: order.id,
                    },
                });
                const buyer = await tx.buyer.findUnique({
                    where: { userId: order.buyerId },
                });
                if (buyer) {
                    await tx.buyer.update({
                        where: { id: buyer.id },
                        data: { rewardPoints: buyer.rewardPoints + rewardPoints },
                    });
                }
            }
            return updatedOrder;
        });
    }
    async getDeliveryStats(userId) {
        const products = await this.prisma.product.findMany({
            where: { seller: { userId } },
        });
        const stats = {
            total: products.length,
            pending: products.filter(p => p.deliveryStatus === 'PENDING').length,
            inTransit: products.filter(p => p.deliveryStatus === 'IN_TRANSIT').length,
            delivered: products.filter(p => p.deliveryStatus === 'DELIVERED').length,
            failed: products.filter(p => p.deliveryStatus === 'FAILED').length,
        };
        return stats;
    }
    async trackOrder(orderId) {
        return await this.prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                status: true,
                deliveryTrackingId: true,
                deliveredAt: true,
                createdAt: true,
                updatedAt: true,
                product: { select: { deliveryStatus: true } }
            },
        });
    }
};
exports.DeliveryManagementService = DeliveryManagementService;
exports.DeliveryManagementService = DeliveryManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], DeliveryManagementService);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeliveryManagementController = void 0;
const common_1 = __webpack_require__(2);
const delivery_management_service_1 = __webpack_require__(75);
const jwt_auth_guard_1 = __webpack_require__(22);
const current_user_decorator_1 = __webpack_require__(23);
const client_1 = __webpack_require__(12);
const roles_decorator_1 = __webpack_require__(30);
let DeliveryManagementController = class DeliveryManagementController {
    constructor(service) {
        this.service = service;
    }
    async getOrders(user, status) {
        const statusEnum = status ? client_1.DeliveryStatus[status] : undefined;
        return this.service.getOrdersByStatus(user.id, statusEnum);
    }
    async updateStatus(user, orderId, body) {
        const status = client_1.DeliveryStatus[body.status];
        return this.service.updateDeliveryStatus(orderId, status, body.trackingId, user.id);
    }
    async getStats(user) {
        return this.service.getDeliveryStats(user.id);
    }
    async trackOrder(orderId) {
        return this.service.trackOrder(orderId);
    }
};
exports.DeliveryManagementController = DeliveryManagementController;
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DeliveryManagementController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)(':orderId/update-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryManagementController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryManagementController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':orderId/track'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryManagementController.prototype, "trackOrder", null);
exports.DeliveryManagementController = DeliveryManagementController = __decorate([
    (0, common_1.Controller)('seller/delivery'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof delivery_management_service_1.DeliveryManagementService !== "undefined" && delivery_management_service_1.DeliveryManagementService) === "function" ? _a : Object])
], DeliveryManagementController);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageModerationModule = void 0;
const common_1 = __webpack_require__(2);
const message_moderation_service_1 = __webpack_require__(78);
const message_moderation_controller_1 = __webpack_require__(79);
const database_module_1 = __webpack_require__(10);
let MessageModerationModule = class MessageModerationModule {
};
exports.MessageModerationModule = MessageModerationModule;
exports.MessageModerationModule = MessageModerationModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [message_moderation_service_1.MessageModerationService],
        controllers: [message_moderation_controller_1.MessageModerationController],
    })
], MessageModerationModule);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageModerationService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const crypto_1 = __webpack_require__(43);
const config_1 = __webpack_require__(6);
let MessageModerationService = class MessageModerationService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const rawKey = this.configService.get('MESSAGE_ENCRYPTION_KEY');
        if (!rawKey) {
            throw new Error('MESSAGE_ENCRYPTION_KEY is not configured');
        }
        this.encryptionKey = (0, crypto_1.getEncryptionKey)(rawKey);
    }
    async flagMessage(flaggedById, messageId, reason) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        return this.prisma.messageModeration.create({
            data: {
                messageId,
                flaggedById,
                reason,
                status: 'FLAGGED',
            },
            include: {
                message: true,
                flaggedBy: { select: { id: true, email: true, name: true } },
            },
        });
    }
    async getFlaggedMessages() {
        const flags = await this.prisma.messageModeration.findMany({
            where: { status: 'FLAGGED' },
            orderBy: { createdAt: 'desc' },
            include: {
                message: {
                    include: {
                        sender: { select: { id: true, name: true, email: true } },
                        receiver: { select: { id: true, name: true, email: true } },
                    },
                },
                flaggedBy: { select: { id: true, name: true, email: true } },
            },
            take: 100,
        });
        return flags.map((f) => ({
            ...f,
            message: {
                ...f.message,
                content: (0, crypto_1.decryptText)(f.message.content, this.encryptionKey),
            },
        }));
    }
    async resolveFlag(messageId) {
        const moderation = await this.prisma.messageModeration.findFirst({
            where: { messageId, status: 'FLAGGED' },
            orderBy: { createdAt: 'desc' },
        });
        if (!moderation)
            throw new common_1.NotFoundException('Flag not found');
        return this.prisma.messageModeration.update({
            where: { id: moderation.id },
            data: { status: 'RESOLVED', resolvedAt: new Date() },
        });
    }
    async blockUser(userId, reason) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });
        return {
            userId,
            blocked: true,
            reason,
            blockedAt: new Date(),
            user,
        };
    }
    async getAbuseReports() {
        const reports = await this.prisma.messageModeration.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                message: {
                    include: {
                        sender: { select: { id: true, name: true, email: true } },
                        receiver: { select: { id: true, name: true, email: true } },
                    },
                },
                flaggedBy: { select: { id: true, name: true, email: true } },
            },
            take: 200,
        });
        return reports.map((r) => ({
            ...r,
            message: {
                ...r.message,
                content: (0, crypto_1.decryptText)(r.message.content, this.encryptionKey),
            },
        }));
    }
};
exports.MessageModerationService = MessageModerationService;
exports.MessageModerationService = MessageModerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], MessageModerationService);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageModerationController = void 0;
const common_1 = __webpack_require__(2);
const message_moderation_service_1 = __webpack_require__(78);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let MessageModerationController = class MessageModerationController {
    constructor(service) {
        this.service = service;
    }
    async flagMessage(req, messageId, body) {
        return this.service.flagMessage(req.user.id, messageId, body.reason);
    }
    async getFlagged() {
        return this.service.getFlaggedMessages();
    }
    async resolve(messageId) {
        return this.service.resolveFlag(messageId);
    }
    async blockUser(userId, body) {
        return this.service.blockUser(userId, body.reason);
    }
    async getReports() {
        return this.service.getAbuseReports();
    }
};
exports.MessageModerationController = MessageModerationController;
__decorate([
    (0, common_1.Post)(':messageId/flag'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessageModerationController.prototype, "flagMessage", null);
__decorate([
    (0, common_1.Get)('flagged'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageModerationController.prototype, "getFlagged", null);
__decorate([
    (0, common_1.Post)(':messageId/resolve'),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageModerationController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':userId/block'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageModerationController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Get)('abuse-reports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageModerationController.prototype, "getReports", null);
exports.MessageModerationController = MessageModerationController = __decorate([
    (0, common_1.Controller)('messages/moderation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN, roles_decorator_1.UserRole.CUSTOMER_SERVICE),
    __metadata("design:paramtypes", [typeof (_a = typeof message_moderation_service_1.MessageModerationService !== "undefined" && message_moderation_service_1.MessageModerationService) === "function" ? _a : Object])
], MessageModerationController);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const common_1 = __webpack_require__(2);
const analytics_service_1 = __webpack_require__(81);
const analytics_controller_1 = __webpack_require__(82);
const database_module_1 = __webpack_require__(10);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [analytics_service_1.AnalyticsService],
        controllers: [analytics_controller_1.AnalyticsController],
    })
], AnalyticsModule);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalRevenue = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'DELIVERED' },
        });
        const totalOrders = await this.prisma.order.count();
        const totalUsers = await this.prisma.buyer.count();
        const totalSellers = await this.prisma.seller.count();
        return {
            totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
            totalOrders,
            totalUsers,
            totalSellers,
        };
    }
    async getTopSellers(limit = 10) {
        return await this.prisma.seller.findMany({
            include: { products: { take: 5 } },
            take: limit,
            orderBy: { products: { _count: 'desc' } },
        });
    }
    async getRevenueTrends(days = 30) {
        const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const orders = await this.prisma.order.findMany({
            where: { createdAt: { gte: dateFrom } },
            select: { createdAt: true, totalAmount: true },
        });
        return {
            period: days,
            totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
            ordersCount: orders.length,
        };
    }
    async getUserGrowth(days = 30) {
        const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const newUsers = await this.prisma.buyer.count({
            where: { createdAt: { gte: dateFrom } },
        });
        const newSellers = await this.prisma.seller.count({
            where: { createdAt: { gte: dateFrom } },
        });
        return { newUsers, newSellers, period: days };
    }
    async getEcoImpactStats() {
        const ecoFriendlyProducts = await this.prisma.product.count({
            where: { ecoScore: { gt: 0 } },
        });
        const ecoImpactAgg = await this.prisma.ecoImpact.aggregate({
            _sum: { pointsEarned: true },
            _count: { _all: true },
        });
        const totalPoints = Number(ecoImpactAgg._sum.pointsEarned || 0);
        return {
            ecoFriendlyProducts,
            carbonSaved: Math.floor(totalPoints * 0.2),
            treesPlanted: Math.floor(totalPoints / 50),
        };
    }
    async getProductStats() {
        return {
            pending: await this.prisma.product.count({
                where: { approvalStatus: 'PENDING' },
            }),
            approved: await this.prisma.product.count({
                where: { approvalStatus: 'APPROVED' },
            }),
            rejected: await this.prisma.product.count({
                where: { approvalStatus: 'REJECTED' },
            }),
            total: await this.prisma.product.count(),
        };
    }
    async getReferralStats() {
        const total = await this.prisma.referral.count();
        const pending = await this.prisma.referral.count({ where: { status: 'PENDING' } });
        const completed = await this.prisma.referral.count({ where: { status: 'COMPLETED' } });
        return { total, pending, completed };
    }
    async getSubscriptionStats() {
        const total = await this.prisma.subscription.count();
        const active = await this.prisma.subscription.count({ where: { status: 'ACTIVE' } });
        const cancelled = await this.prisma.subscription.count({ where: { status: 'CANCELLED' } });
        const expired = await this.prisma.subscription.count({ where: { status: 'EXPIRED' } });
        return { total, active, cancelled, expired };
    }
    async getBuyerRetention() {
        const buyers = await this.prisma.user.findMany({
            where: { role: 'BUYER' },
            select: { id: true },
        });
        const buyerIds = buyers.map((b) => b.id);
        const repeatBuyers = await this.prisma.order.groupBy({
            by: ['buyerId'],
            where: { buyerId: { in: buyerIds } },
            _count: { _all: true },
        });
        const retained = repeatBuyers.filter((b) => b._count._all >= 2).length;
        return { totalBuyers: buyerIds.length, repeatBuyers: retained };
    }
    async getTopCategories(limit = 10) {
        const rows = await this.prisma
            .$queryRaw `SELECT category, COUNT(*)::bigint AS count FROM products GROUP BY category ORDER BY count DESC LIMIT ${limit}`;
        return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AnalyticsService);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsController = void 0;
const common_1 = __webpack_require__(2);
const analytics_service_1 = __webpack_require__(81);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
let AnalyticsController = class AnalyticsController {
    constructor(service) {
        this.service = service;
    }
    async getDashboard() {
        return this.service.getDashboardStats();
    }
    async getTopSellers(limit) {
        return this.service.getTopSellers(parseInt(limit || '10'));
    }
    async getRevenueTrends(days) {
        return this.service.getRevenueTrends(parseInt(days || '30'));
    }
    async getEcoImpact() {
        return this.service.getEcoImpactStats();
    }
    async getUserGrowth(days) {
        return this.service.getUserGrowth(parseInt(days || '30'));
    }
    async getProductStats() {
        return this.service.getProductStats();
    }
    async getReferralStats() {
        return this.service.getReferralStats();
    }
    async getSubscriptionStats() {
        return this.service.getSubscriptionStats();
    }
    async getBuyerRetention() {
        return this.service.getBuyerRetention();
    }
    async getTopCategories(limit) {
        return this.service.getTopCategories(parseInt(limit || '10'));
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('top-sellers'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopSellers", null);
__decorate([
    (0, common_1.Get)('revenue-trends'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenueTrends", null);
__decorate([
    (0, common_1.Get)('eco-impact'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEcoImpact", null);
__decorate([
    (0, common_1.Get)('user-growth'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserGrowth", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getProductStats", null);
__decorate([
    (0, common_1.Get)('referrals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReferralStats", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSubscriptionStats", null);
__decorate([
    (0, common_1.Get)('retention'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBuyerRetention", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopCategories", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('admin/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrivacyModule = void 0;
const common_1 = __webpack_require__(2);
const privacy_service_1 = __webpack_require__(84);
const privacy_controller_1 = __webpack_require__(85);
const database_module_1 = __webpack_require__(10);
let PrivacyModule = class PrivacyModule {
};
exports.PrivacyModule = PrivacyModule;
exports.PrivacyModule = PrivacyModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [privacy_service_1.PrivacyService],
        controllers: [privacy_controller_1.PrivacyController],
        exports: [privacy_service_1.PrivacyService],
    })
], PrivacyModule);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrivacyService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let PrivacyService = class PrivacyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPrivacySettings(userId) {
        return this.prisma.privacySettings.findUnique({
            where: { userId },
        });
    }
    async updatePrivacySettings(userId, dto) {
        return this.prisma.privacySettings.upsert({
            where: { userId },
            update: {
                dataCollection: dto.dataCollection,
                marketing: dto.marketing,
                analytics: dto.analytics,
                lastUpdatedAt: new Date(),
            },
            create: {
                userId,
                dataCollection: dto.dataCollection,
                marketing: dto.marketing,
                analytics: dto.analytics,
            },
        });
    }
    async requestDataExport(userId) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return this.prisma.dataExportLog.create({
            data: {
                userId,
                format: "JSON",
                expiresAt,
            },
        });
    }
    async getDataExports(userId) {
        return this.prisma.dataExportLog.findMany({
            where: { userId },
            orderBy: { exportedAt: "desc" },
        });
    }
    async requestAccountDeletion(userId) {
        return this.prisma.privacySettings.upsert({
            where: { userId },
            update: {
                deletionRequested: new Date(),
            },
            create: {
                userId,
                deletionRequested: new Date(),
            },
        });
    }
    async cancelDeletionRequest(userId) {
        return this.prisma.privacySettings.update({
            where: { userId },
            data: {
                deletionRequested: null,
            },
        });
    }
    async getPendingDeletions(daysUntilDeletion = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysUntilDeletion);
        return this.prisma.privacySettings.findMany({
            where: {
                deletionRequested: {
                    not: null,
                    lte: cutoffDate,
                },
            },
            include: { user: true },
        });
    }
    async deleteUserData(userId) {
        await this.prisma.message.deleteMany({ where: { senderId: userId } });
        await this.prisma.ticket.deleteMany({ where: { userId } });
        await this.prisma.transaction.deleteMany({ where: { userId } });
        await this.prisma.privacySettings.update({
            where: { userId },
            data: { deletionAt: new Date() },
        });
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
};
exports.PrivacyService = PrivacyService;
exports.PrivacyService = PrivacyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PrivacyService);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrivacyController = void 0;
const common_1 = __webpack_require__(2);
const privacy_service_1 = __webpack_require__(84);
const create_privacy_settings_dto_1 = __webpack_require__(86);
const jwt_guard_1 = __webpack_require__(87);
let PrivacyController = class PrivacyController {
    constructor(service) {
        this.service = service;
    }
    async getSettings(req) {
        return this.service.getPrivacySettings(req.user.id);
    }
    async updateSettings(req, dto) {
        return this.service.updatePrivacySettings(req.user.id, dto);
    }
    async requestDataExport(req) {
        return this.service.requestDataExport(req.user.id);
    }
    async getDataExports(req) {
        return this.service.getDataExports(req.user.id);
    }
    async requestAccountDeletion(req) {
        return this.service.requestAccountDeletion(req.user.id);
    }
    async cancelDeletionRequest(req) {
        return this.service.cancelDeletionRequest(req.user.id);
    }
};
exports.PrivacyController = PrivacyController;
__decorate([
    (0, common_1.Get)("settings"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)("settings"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_privacy_settings_dto_1.CreatePrivacySettingsDto !== "undefined" && create_privacy_settings_dto_1.CreatePrivacySettingsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)("export"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "requestDataExport", null);
__decorate([
    (0, common_1.Get)("exports"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "getDataExports", null);
__decorate([
    (0, common_1.Post)("delete-account"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "requestAccountDeletion", null);
__decorate([
    (0, common_1.Post)("cancel-deletion"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "cancelDeletionRequest", null);
exports.PrivacyController = PrivacyController = __decorate([
    (0, common_1.Controller)("privacy"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof privacy_service_1.PrivacyService !== "undefined" && privacy_service_1.PrivacyService) === "function" ? _a : Object])
], PrivacyController);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePrivacySettingsDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreatePrivacySettingsDto {
}
exports.CreatePrivacySettingsDto = CreatePrivacySettingsDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePrivacySettingsDto.prototype, "dataCollection", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePrivacySettingsDto.prototype, "marketing", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePrivacySettingsDto.prototype, "analytics", void 0);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
let JwtGuard = class JwtGuard extends (0, passport_1.AuthGuard)("jwt") {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw err || new Error("Unauthorized");
        }
        return user;
    }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)()
], JwtGuard);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerServiceModule = void 0;
const common_1 = __webpack_require__(2);
const customer_service_service_1 = __webpack_require__(89);
const customer_service_controller_1 = __webpack_require__(90);
const database_module_1 = __webpack_require__(10);
let CustomerServiceModule = class CustomerServiceModule {
};
exports.CustomerServiceModule = CustomerServiceModule;
exports.CustomerServiceModule = CustomerServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [customer_service_service_1.CustomerServiceService],
        controllers: [customer_service_controller_1.CustomerServiceController],
        exports: [customer_service_service_1.CustomerServiceService],
    })
], CustomerServiceModule);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerServiceService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let CustomerServiceService = class CustomerServiceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTicket(userId, dto) {
        return this.prisma.ticket.create({
            data: {
                userId,
                issueType: dto.issueType,
                subject: dto.subject,
                description: dto.description,
                status: "OPEN",
                priority: (dto.priority || "MEDIUM"),
            },
        });
    }
    async getTickets(userId) {
        return this.prisma.ticket.findMany({
            where: { userId },
            include: { responses: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async getTicket(id) {
        return this.prisma.ticket.findUnique({
            where: { id },
            include: { responses: { orderBy: { createdAt: "asc" } } },
        });
    }
    async updateTicketStatus(id, status) {
        return this.prisma.ticket.update({
            where: { id },
            data: { status: status },
        });
    }
    async addResponse(ticketId, userId, message) {
        return this.prisma.ticketResponse.create({
            data: {
                ticketId,
                userId,
                message,
            },
        });
    }
    async getOpenTickets() {
        return this.prisma.ticket.findMany({
            where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
            orderBy: { createdAt: "asc" },
        });
    }
    async assignTicket(ticketId, csUserId) {
        return this.prisma.ticket.update({
            where: { id: ticketId },
            data: { csUserId, status: "IN_PROGRESS" },
        });
    }
};
exports.CustomerServiceService = CustomerServiceService;
exports.CustomerServiceService = CustomerServiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CustomerServiceService);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerServiceController = void 0;
const common_1 = __webpack_require__(2);
const customer_service_service_1 = __webpack_require__(89);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
const create_ticket_dto_1 = __webpack_require__(91);
let CustomerServiceController = class CustomerServiceController {
    constructor(service) {
        this.service = service;
    }
    async createTicket(req, dto) {
        return this.service.createTicket(req.user.id, dto);
    }
    async getMyTickets(req) {
        return this.service.getTickets(req.user.id);
    }
    async getTicket(id) {
        return this.service.getTicket(id);
    }
    async updateStatus(id, { status }) {
        return this.service.updateTicketStatus(id, status);
    }
    async addResponse(id, req, { message }) {
        return this.service.addResponse(id, req.user.id, message);
    }
    async getOpenTickets() {
        return this.service.getOpenTickets();
    }
    async assignTicket(id, req) {
        return this.service.assignTicket(id, req.user.id);
    }
};
exports.CustomerServiceController = CustomerServiceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_ticket_dto_1.CreateTicketDto !== "undefined" && create_ticket_dto_1.CreateTicketDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Get)("my"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "getMyTickets", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "getTicket", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CUSTOMER_SERVICE, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(":id/response"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "addResponse", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CUSTOMER_SERVICE, roles_decorator_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "getOpenTickets", null);
__decorate([
    (0, common_1.Patch)(":id/assign"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN, roles_decorator_1.UserRole.CUSTOMER_SERVICE),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerServiceController.prototype, "assignTicket", null);
exports.CustomerServiceController = CustomerServiceController = __decorate([
    (0, common_1.Controller)("tickets"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof customer_service_service_1.CustomerServiceService !== "undefined" && customer_service_service_1.CustomerServiceService) === "function" ? _a : Object])
], CustomerServiceController);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTicketDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateTicketDto {
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "issueType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "priority", void 0);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketModule = void 0;
const common_1 = __webpack_require__(2);
const websocket_gateway_1 = __webpack_require__(93);
const websocket_service_1 = __webpack_require__(96);
const database_module_1 = __webpack_require__(10);
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [websocket_gateway_1.NotificationGateway, websocket_service_1.WebSocketService],
        exports: [websocket_service_1.WebSocketService],
    })
], WebSocketModule);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationGateway = void 0;
const websockets_1 = __webpack_require__(94);
const socket_io_1 = __webpack_require__(95);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let NotificationGateway = class NotificationGateway {
    constructor(prisma) {
        this.prisma = prisma;
    }
    handleConnection(client) {
        console.log(`[WebSocket] Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`[WebSocket] Client disconnected: ${client.id}`);
    }
    handleJoin(data, client) {
        client.join(`user:${data.userId}`);
        return { event: "joined", data: { userId: data.userId } };
    }
    async handleMessage(data, client) {
        this.server.to(`user:${data.recipientId}`).emit("new_message", data);
    }
    async broadcastTicketUpdate(ticketId, update) {
        this.server.emit(`ticket:${ticketId}`, update);
    }
    async notifyUser(userId, notification) {
        this.server.to(`user:${userId}`).emit("notification", notification);
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("join"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("send_message"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMessage", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: "*" } }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationGateway);


/***/ }),
/* 94 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 95 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketService = void 0;
const common_1 = __webpack_require__(2);
let WebSocketService = class WebSocketService {
    setServer(io) {
        this.io = io;
    }
    async notifyOrderUpdate(userId, orderId, status) {
        this.io.to(userId).emit("order-update", { orderId, status });
    }
    async notifyDeliveryUpdate(userId, orderId, status, trackingId) {
        this.io.to(userId).emit("delivery-update", { orderId, status, trackingId });
    }
    async notifyMessage(userId, message) {
        this.io.to(userId).emit("new-message", message);
    }
    joinUserRoom(socket, userId) {
        socket.join(userId);
    }
    leaveUserRoom(socket, userId) {
        socket.leave(userId);
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, common_1.Injectable)()
], WebSocketService);


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION || process.env.JWT_EXPIRES_IN || "24h",
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS || "10"),
    },
    commerce: {
        processingFeeRate: parseFloat(process.env.PROCESSING_FEE_RATE || "0.05"),
        ecoPointsPerDollar: parseFloat(process.env.ECO_POINTS_PER_DOLLAR || "1"),
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
    },
});


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisputesModule = void 0;
const common_1 = __webpack_require__(2);
const disputes_service_1 = __webpack_require__(99);
const disputes_controller_1 = __webpack_require__(100);
const database_module_1 = __webpack_require__(10);
let DisputesModule = class DisputesModule {
};
exports.DisputesModule = DisputesModule;
exports.DisputesModule = DisputesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [disputes_service_1.DisputesService],
        controllers: [disputes_controller_1.DisputesController, disputes_controller_1.AdminDisputesController],
    })
], DisputesModule);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisputesService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const roles_decorator_1 = __webpack_require__(30);
const config_1 = __webpack_require__(6);
const schedule_1 = __webpack_require__(9);
let DisputesService = class DisputesService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async create(userId, role, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
            include: { product: { include: { seller: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const isBuyer = order.buyerId === userId;
        const isSeller = order.product?.seller?.userId === userId;
        if (!isBuyer && !isSeller && role !== roles_decorator_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const slaHours = Number(this.configService.get('DISPUTE_SLA_HOURS') || 72);
        const dueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);
        const dispute = await this.prisma.dispute.create({
            data: {
                orderId: dto.orderId,
                openedById: userId,
                reason: dto.reason,
                priority: dto.priority,
                dueAt,
            },
        });
        await this.createNotification(order.buyerId, 'DISPUTE_OPENED', `Dispute opened for order ${order.id}`, { disputeId: dispute.id });
        if (order.product?.seller?.userId) {
            await this.createNotification(order.product.seller.userId, 'DISPUTE_OPENED', `Dispute opened for order ${order.id}`, { disputeId: dispute.id });
        }
        return dispute;
    }
    async myDisputes(userId) {
        return this.prisma.dispute.findMany({
            where: { openedById: userId },
            include: { order: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async list(status) {
        return this.prisma.dispute.findMany({
            where: status ? { status: status } : undefined,
            include: { order: true, openedBy: true, assignedTo: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(disputeId, resolvedById, dto) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
        });
        if (!dispute)
            throw new common_1.NotFoundException('Dispute not found');
        const updated = await this.prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: dto.status ?? dispute.status,
                resolution: dto.resolution ?? dispute.resolution,
                assignedToId: dto.assignedToId ?? dispute.assignedToId,
                resolvedAt: dto.status === 'RESOLVED' ? new Date() : dispute.resolvedAt,
                resolvedById: dto.status === 'RESOLVED' ? resolvedById : dispute.resolvedById,
            },
        });
        if (dto.status === 'RESOLVED') {
            await this.createNotification(dispute.openedById, 'DISPUTE_RESOLVED', `Dispute ${disputeId} resolved`, { disputeId });
        }
        return updated;
    }
    async markOverdue() {
        const now = new Date();
        const overdue = await this.prisma.dispute.findMany({
            where: {
                status: { in: ['OPEN', 'IN_REVIEW'] },
                dueAt: { lte: now },
            },
        });
        for (const d of overdue) {
            await this.createNotification(d.openedById, 'DISPUTE_OVERDUE', `Dispute ${d.id} is overdue`, { disputeId: d.id });
        }
    }
    async createNotification(userId, type, message, metadata) {
        await this.prisma.notification.create({
            data: { userId, type, message, metadata },
        });
    }
};
exports.DisputesService = DisputesService;
__decorate([
    (0, schedule_1.Cron)('*/30 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DisputesService.prototype, "markOverdue", null);
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], DisputesService);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminDisputesController = exports.DisputesController = void 0;
const common_1 = __webpack_require__(2);
const disputes_service_1 = __webpack_require__(99);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
const create_dispute_dto_1 = __webpack_require__(101);
const update_dispute_dto_1 = __webpack_require__(102);
let DisputesController = class DisputesController {
    constructor(service) {
        this.service = service;
    }
    async create(req, dto) {
        return this.service.create(req.user.id, req.user.role, dto);
    }
    async my(req) {
        return this.service.myDisputes(req.user.id);
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_dispute_dto_1.CreateDisputeDto !== "undefined" && create_dispute_dto_1.CreateDisputeDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.SELLER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "my", null);
exports.DisputesController = DisputesController = __decorate([
    (0, common_1.Controller)('disputes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof disputes_service_1.DisputesService !== "undefined" && disputes_service_1.DisputesService) === "function" ? _a : Object])
], DisputesController);
let AdminDisputesController = class AdminDisputesController {
    constructor(service) {
        this.service = service;
    }
    async list(status) {
        return this.service.list(status);
    }
    async update(req, id, dto) {
        return this.service.update(id, req.user.id, dto);
    }
};
exports.AdminDisputesController = AdminDisputesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminDisputesController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_d = typeof update_dispute_dto_1.UpdateDisputeDto !== "undefined" && update_dispute_dto_1.UpdateDisputeDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AdminDisputesController.prototype, "update", null);
exports.AdminDisputesController = AdminDisputesController = __decorate([
    (0, common_1.Controller)('admin/disputes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.ADMIN, roles_decorator_1.UserRole.CUSTOMER_SERVICE),
    __metadata("design:paramtypes", [typeof (_c = typeof disputes_service_1.DisputesService !== "undefined" && disputes_service_1.DisputesService) === "function" ? _c : Object])
], AdminDisputesController);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateDisputeDto = void 0;
const class_validator_1 = __webpack_require__(20);
const client_1 = __webpack_require__(12);
class CreateDisputeDto {
}
exports.CreateDisputeDto = CreateDisputeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisputeDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDisputeDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", typeof (_a = typeof client_1.DisputePriority !== "undefined" && client_1.DisputePriority) === "function" ? _a : Object)
], CreateDisputeDto.prototype, "priority", void 0);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateDisputeDto = void 0;
const class_validator_1 = __webpack_require__(20);
const client_1 = __webpack_require__(12);
class UpdateDisputeDto {
}
exports.UpdateDisputeDto = UpdateDisputeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", typeof (_a = typeof client_1.DisputeStatus !== "undefined" && client_1.DisputeStatus) === "function" ? _a : Object)
], UpdateDisputeDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisputeDto.prototype, "resolution", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDisputeDto.prototype, "assignedToId", void 0);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferralsModule = void 0;
const common_1 = __webpack_require__(2);
const referrals_service_1 = __webpack_require__(104);
const referrals_controller_1 = __webpack_require__(105);
const database_module_1 = __webpack_require__(10);
let ReferralsModule = class ReferralsModule {
};
exports.ReferralsModule = ReferralsModule;
exports.ReferralsModule = ReferralsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [referrals_service_1.ReferralsService],
        controllers: [referrals_controller_1.ReferralsController],
    })
], ReferralsModule);


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferralsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let ReferralsService = class ReferralsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(referrerId, dto) {
        return this.prisma.referral.create({
            data: {
                referrerId,
                refereeId: dto.refereeId,
            },
        });
    }
    async mine(userId) {
        return this.prisma.referral.findMany({
            where: { referrerId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReferralsService);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferralsController = void 0;
const common_1 = __webpack_require__(2);
const referrals_service_1 = __webpack_require__(104);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
const create_referral_dto_1 = __webpack_require__(106);
let ReferralsController = class ReferralsController {
    constructor(service) {
        this.service = service;
    }
    async create(req, dto) {
        return this.service.create(req.user.id, dto);
    }
    async mine(req) {
        return this.service.mine(req.user.id);
    }
};
exports.ReferralsController = ReferralsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_referral_dto_1.CreateReferralDto !== "undefined" && create_referral_dto_1.CreateReferralDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "mine", null);
exports.ReferralsController = ReferralsController = __decorate([
    (0, common_1.Controller)('referrals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof referrals_service_1.ReferralsService !== "undefined" && referrals_service_1.ReferralsService) === "function" ? _a : Object])
], ReferralsController);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateReferralDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateReferralDto {
}
exports.CreateReferralDto = CreateReferralDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "refereeId", void 0);


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionsModule = void 0;
const common_1 = __webpack_require__(2);
const subscriptions_service_1 = __webpack_require__(108);
const subscriptions_controller_1 = __webpack_require__(109);
const database_module_1 = __webpack_require__(10);
let SubscriptionsModule = class SubscriptionsModule {
};
exports.SubscriptionsModule = SubscriptionsModule;
exports.SubscriptionsModule = SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [subscriptions_service_1.SubscriptionsService],
        controllers: [subscriptions_controller_1.SubscriptionsController],
    })
], SubscriptionsModule);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.subscription.create({
            data: {
                userId,
                plan: dto.plan,
                status: 'ACTIVE',
            },
        });
    }
    async cancel(userId, id) {
        const sub = await this.prisma.subscription.findUnique({ where: { id } });
        if (!sub || sub.userId !== userId) {
            throw new Error('Not authorized');
        }
        return this.prisma.subscription.update({
            where: { id },
            data: { status: 'CANCELLED', endsAt: new Date() },
        });
    }
    async mine(userId) {
        return this.prisma.subscription.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SubscriptionsService);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionsController = void 0;
const common_1 = __webpack_require__(2);
const subscriptions_service_1 = __webpack_require__(108);
const jwt_auth_guard_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(30);
const create_subscription_dto_1 = __webpack_require__(110);
let SubscriptionsController = class SubscriptionsController {
    constructor(service) {
        this.service = service;
    }
    async create(req, dto) {
        return this.service.create(req.user.id, dto);
    }
    async mine(req) {
        return this.service.mine(req.user.id);
    }
    async cancel(req, id) {
        return this.service.cancel(req.user.id, id);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_subscription_dto_1.CreateSubscriptionDto !== "undefined" && create_subscription_dto_1.CreateSubscriptionDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "mine", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "cancel", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.BUYER, roles_decorator_1.UserRole.SELLER, roles_decorator_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [typeof (_a = typeof subscriptions_service_1.SubscriptionsService !== "undefined" && subscriptions_service_1.SubscriptionsService) === "function" ? _a : Object])
], SubscriptionsController);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSubscriptionDto = void 0;
const class_validator_1 = __webpack_require__(20);
class CreateSubscriptionDto {
}
exports.CreateSubscriptionDto = CreateSubscriptionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "plan", void 0);


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FulfillmentModule = void 0;
const common_1 = __webpack_require__(2);
const fulfillment_service_1 = __webpack_require__(112);
const database_module_1 = __webpack_require__(10);
let FulfillmentModule = class FulfillmentModule {
};
exports.FulfillmentModule = FulfillmentModule;
exports.FulfillmentModule = FulfillmentModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [fulfillment_service_1.FulfillmentService],
    })
], FulfillmentModule);


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FulfillmentService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(9);
const prisma_service_1 = __webpack_require__(11);
const client_1 = __webpack_require__(12);
let FulfillmentService = class FulfillmentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async autoAdvance() {
        if (process.env.AUTO_FULFILL !== 'true')
            return;
        const stepHours = Number(process.env.AUTO_FULFILL_STEP_HOURS || 24);
        const now = new Date();
        const processingCutoff = new Date(now.getTime() - stepHours * 60 * 60 * 1000);
        const shippedCutoff = new Date(now.getTime() - stepHours * 2 * 60 * 60 * 1000);
        const processingOrders = await this.prisma.order.findMany({
            where: { status: 'PROCESSING', paymentStatus: 'SUCCEEDED', createdAt: { lte: processingCutoff } },
            include: { product: true },
        });
        for (const order of processingOrders) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: 'SHIPPED' },
            });
            await this.prisma.product.update({
                where: { id: order.productId },
                data: { deliveryStatus: client_1.DeliveryStatus.IN_TRANSIT },
            });
        }
        const shippedOrders = await this.prisma.order.findMany({
            where: { status: 'SHIPPED', paymentStatus: 'SUCCEEDED', createdAt: { lte: shippedCutoff } },
            include: { product: true },
        });
        for (const order of shippedOrders) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: 'DELIVERED', deliveredAt: new Date() },
            });
            await this.prisma.product.update({
                where: { id: order.productId },
                data: { deliveryStatus: client_1.DeliveryStatus.DELIVERED },
            });
        }
    }
};
exports.FulfillmentService = FulfillmentService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FulfillmentService.prototype, "autoAdvance", null);
exports.FulfillmentService = FulfillmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FulfillmentService);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const express_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, express_1.json)({
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    }));
    const corsOrigin = (process.env.CORS_ORIGIN || "*").trim();
    const allowAll = corsOrigin === "*";
    const allowedOrigins = allowAll
        ? []
        : corsOrigin
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean);
    app.enableCors({
        origin: allowAll
            ? true
            : (origin, callback) => {
                if (!origin) {
                    return callback(null, true);
                }
                const isAllowed = allowedOrigins.includes(origin);
                return callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
            },
        credentials: !allowAll,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("EARTHLYN Backend API")
        .setDescription("E-commerce API for sustainable products")
        .setVersion("1.0.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`API running on port ${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
bootstrap().catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
});

})();

/******/ })()
;