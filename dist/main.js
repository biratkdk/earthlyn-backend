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

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
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
const config_1 = __webpack_require__(5);
const jwt_1 = __webpack_require__(6);
const database_module_1 = __webpack_require__(7);
const app_controller_1 = __webpack_require__(10);
const auth_module_1 = __webpack_require__(11);
const seller_module_1 = __webpack_require__(23);
const buyer_module_1 = __webpack_require__(27);
const admin_module_1 = __webpack_require__(33);
const messaging_module_1 = __webpack_require__(39);
const order_module_1 = __webpack_require__(43);
const payment_module_1 = __webpack_require__(47);
const product_module_1 = __webpack_require__(52);
const product_approval_module_1 = __webpack_require__(55);
const seller_kyc_module_1 = __webpack_require__(59);
const delivery_management_module_1 = __webpack_require__(62);
const message_moderation_module_1 = __webpack_require__(65);
const analytics_module_1 = __webpack_require__(68);
const configuration_1 = __importDefault(__webpack_require__(71));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: '.env',
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory: (configService) => ({
                    secret: configService.get('jwt.secret'),
                    signOptions: {
                        expiresIn: configService.get('jwt.expiresIn'),
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
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 7 */
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
const prisma_service_1 = __webpack_require__(8);
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
/* 8 */
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
const client_1 = __webpack_require__(9);
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
/* 9 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 10 */
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
/* 11 */
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
const passport_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(13);
const auth_controller_1 = __webpack_require__(15);
const jwt_strategy_1 = __webpack_require__(21);
const database_module_1 = __webpack_require__(7);
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
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 13 */
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
const jwt_1 = __webpack_require__(6);
const bcrypt = __importStar(__webpack_require__(14));
const config_1 = __webpack_require__(5);
const prisma_service_1 = __webpack_require__(8);
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
/* 14 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 15 */
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
const auth_service_1 = __webpack_require__(13);
const login_dto_1 = __webpack_require__(16);
const register_dto_1 = __webpack_require__(18);
const jwt_auth_guard_1 = __webpack_require__(19);
const current_user_decorator_1 = __webpack_require__(20);
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
/* 16 */
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
const class_validator_1 = __webpack_require__(17);
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
/* 17 */
/***/ ((module) => {

module.exports = require("class-validator");

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(17);
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


/***/ }),
/* 19 */
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
const passport_1 = __webpack_require__(12);
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
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentUser = void 0;
const common_1 = __webpack_require__(2);
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(12);
const passport_jwt_1 = __webpack_require__(22);
const config_1 = __webpack_require__(5);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) { super({ jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: configService.get('jwt.secret'), }); }
    validate(payload) { return { id: payload.sub, email: payload.email, role: payload.role }; }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 23 */
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
const seller_service_1 = __webpack_require__(24);
const seller_controller_1 = __webpack_require__(25);
const database_module_1 = __webpack_require__(7);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
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
    async update(id, data) {
        return this.prismaService.seller.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prismaService.seller.delete({ where: { id } });
    }
};
exports.SellerService = SellerService;
exports.SellerService = SellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SellerService);


/***/ }),
/* 25 */
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
const seller_service_1 = __webpack_require__(24);
const create_seller_dto_1 = __webpack_require__(26);
const jwt_auth_guard_1 = __webpack_require__(19);
let SellerController = class SellerController {
    constructor(sellerService) {
        this.sellerService = sellerService;
    }
    create(createSellerDto) { return this.sellerService.create(createSellerDto); }
    findAll() { return this.sellerService.findAll(); }
    findOne(id) { return this.sellerService.findOne(id); }
    update(id, data) { return this.sellerService.update(id, data); }
    remove(id) { return this.sellerService.remove(id); }
};
exports.SellerController = SellerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_seller_dto_1.CreateSellerDto !== "undefined" && create_seller_dto_1.CreateSellerDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "remove", null);
exports.SellerController = SellerController = __decorate([
    (0, common_1.Controller)('sellers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof seller_service_1.SellerService !== "undefined" && seller_service_1.SellerService) === "function" ? _a : Object])
], SellerController);


/***/ }),
/* 26 */
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
const class_validator_1 = __webpack_require__(17);
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
/* 27 */
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
const buyer_service_1 = __webpack_require__(28);
const buyer_controller_1 = __webpack_require__(29);
const database_module_1 = __webpack_require__(7);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuyerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
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
};
exports.BuyerService = BuyerService;
exports.BuyerService = BuyerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BuyerService);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuyerController = void 0;
const common_1 = __webpack_require__(2);
const buyer_service_1 = __webpack_require__(28);
const create_buyer_dto_1 = __webpack_require__(30);
const update_buyer_dto_1 = __webpack_require__(31);
const jwt_guard_1 = __webpack_require__(32);
let BuyerController = class BuyerController {
    constructor(buyerService) {
        this.buyerService = buyerService;
    }
    async create(createBuyerDto) {
        return this.buyerService.create(createBuyerDto);
    }
    async findAll() {
        return this.buyerService.findAll();
    }
    async findOne(id) {
        return this.buyerService.findOne(id);
    }
    async update(id, updateBuyerDto) {
        return this.buyerService.update(id, updateBuyerDto);
    }
    async remove(id) {
        return this.buyerService.remove(id);
    }
};
exports.BuyerController = BuyerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_buyer_dto_1.CreateBuyerDto !== "undefined" && create_buyer_dto_1.CreateBuyerDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_buyer_dto_1.UpdateBuyerDto !== "undefined" && update_buyer_dto_1.UpdateBuyerDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuyerController.prototype, "remove", null);
exports.BuyerController = BuyerController = __decorate([
    (0, common_1.Controller)('buyers'),
    __metadata("design:paramtypes", [typeof (_a = typeof buyer_service_1.BuyerService !== "undefined" && buyer_service_1.BuyerService) === "function" ? _a : Object])
], BuyerController);


/***/ }),
/* 30 */
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
const class_validator_1 = __webpack_require__(17);
class CreateBuyerDto {
}
exports.CreateBuyerDto = CreateBuyerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuyerDto.prototype, "userId", void 0);


/***/ }),
/* 31 */
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
const class_validator_1 = __webpack_require__(17);
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
/* 32 */
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
const passport_1 = __webpack_require__(12);
let JwtGuard = class JwtGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) { return super.canActivate(context); }
    handleRequest(err, user, info) { if (err || !user) {
        throw err || new Error('Unauthorized');
    } return user; }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)()
], JwtGuard);


/***/ }),
/* 33 */
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
const admin_service_1 = __webpack_require__(34);
const admin_controller_1 = __webpack_require__(35);
const database_module_1 = __webpack_require__(7);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
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
    async approveSeller(sellerId) {
        const seller = await this.prisma.seller.findUnique({
            where: { id: sellerId },
        });
        if (!seller)
            throw new common_1.NotFoundException('Seller not found');
        return this.prisma.seller.update({
            where: { id: sellerId },
            data: { kycStatus: 'APPROVED' },
        });
    }
    async manageBalance(manageBalanceDto) {
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
            },
        });
        await this.prisma.user.update({
            where: { id: manageBalanceDto.userId },
            data: { balance: newBalance },
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(2);
const admin_service_1 = __webpack_require__(34);
const manage_balance_dto_1 = __webpack_require__(36);
const jwt_guard_1 = __webpack_require__(32);
const roles_decorator_1 = __webpack_require__(37);
const roles_guard_1 = __webpack_require__(38);
const roles_decorator_2 = __webpack_require__(37);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() { return this.adminService.getStats(); }
    async getUserList(skip = 0, take = 10) { return this.adminService.getUserList(skip, take); }
    async approveSeller(body) { return this.adminService.approveSeller(body.sellerId); }
    async manageBalance(manageBalanceDto) { return this.adminService.manageBalance(manageBalanceDto); }
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveSeller", null);
__decorate([
    (0, common_1.Post)('manage-balance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof manage_balance_dto_1.ManageBalanceDto !== "undefined" && manage_balance_dto_1.ManageBalanceDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "manageBalance", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 36 */
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
const class_validator_1 = __webpack_require__(17);
const client_1 = __webpack_require__(9);
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
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.UserRole = void 0;
const common_1 = __webpack_require__(2);
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["SELLER"] = "seller";
    UserRole["BUYER"] = "buyer";
})(UserRole || (exports.UserRole = UserRole = {}));
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('No user found');
        }
        const hasRole = () => requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRole()) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 39 */
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
const messaging_service_1 = __webpack_require__(40);
const messaging_controller_1 = __webpack_require__(41);
const database_module_1 = __webpack_require__(7);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessagingService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
let MessagingService = class MessagingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(createMessageDto) {
        return this.prisma.message.create({
            data: {
                senderId: createMessageDto.senderId,
                receiverId: createMessageDto.receiverId,
                content: createMessageDto.content,
            },
        });
    }
    async getConversation(userId, otherUserId) {
        return this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
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
                conversationMap.set(otherUserId, message);
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
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MessagingService);


/***/ }),
/* 41 */
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
const messaging_service_1 = __webpack_require__(40);
const create_message_dto_1 = __webpack_require__(42);
const jwt_guard_1 = __webpack_require__(32);
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
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof messaging_service_1.MessagingService !== "undefined" && messaging_service_1.MessagingService) === "function" ? _a : Object])
], MessagingController);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMessageDto = void 0;
const class_validator_1 = __webpack_require__(17);
class CreateMessageDto {
}
exports.CreateMessageDto = CreateMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "receiverId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);


/***/ }),
/* 43 */
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
const order_service_1 = __webpack_require__(44);
const order_controller_1 = __webpack_require__(45);
const database_module_1 = __webpack_require__(7);
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
/* 44 */
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
exports.OrderService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
let OrderService = class OrderService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(buyerId, createOrderDto) {
        const product = await this.prismaService.product.findUnique({
            where: { id: createOrderDto.productId },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        const totalAmount = Number(product.price) * createOrderDto.quantity;
        return this.prismaService.order.create({
            data: {
                buyerId,
                productId: createOrderDto.productId,
                quantity: createOrderDto.quantity,
                totalAmount: totalAmount.toString(),
            },
            include: {
                product: true,
                buyer: true,
            },
        });
    }
    async findAll(filters) {
        return this.prismaService.order.findMany({
            where: filters,
            include: {
                product: true,
                buyer: true,
            },
            orderBy: { createdAt: 'desc' },
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
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByStatus(status) {
        return this.prismaService.order.findMany({
            where: { status },
            include: {
                product: true,
                buyer: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], OrderService);


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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderController = void 0;
const common_1 = __webpack_require__(2);
const order_service_1 = __webpack_require__(44);
const create_order_dto_1 = __webpack_require__(46);
const client_1 = __webpack_require__(9);
const jwt_auth_guard_1 = __webpack_require__(19);
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
    findByBuyer(buyerId) {
        return this.orderService.findByBuyer(buyerId);
    }
    findByStatus(status) {
        return this.orderService.findByStatus(status);
    }
    findOne(id) {
        return this.orderService.findOne(id);
    }
    update(id, data) {
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_order_dto_1.CreateOrderDto !== "undefined" && create_order_dto_1.CreateOrderDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('buyerId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('buyer/:buyerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findByBuyer", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
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
exports.CreateOrderDto = void 0;
const class_validator_1 = __webpack_require__(17);
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "buyerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "quantity", void 0);


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
exports.PaymentModule = void 0;
const common_1 = __webpack_require__(2);
const payment_service_1 = __webpack_require__(48);
const payment_controller_1 = __webpack_require__(50);
const database_module_1 = __webpack_require__(7);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const stripe_1 = __importDefault(__webpack_require__(49));
let PaymentService = class PaymentService {
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get("STRIPE_SECRET_KEY");
        if (!apiKey) {
            console.warn(`Warning: STRIPE_SECRET_KEY not configured, using Stripe test key`);
            this.stripe = new stripe_1.default("sk_test_4eC39HqLyjWDarhtT657As", {
                timeout: 90000,
            });
        }
        else {
            this.stripe = new stripe_1.default(apiKey, {
                timeout: 90000,
            });
        }
    }
    async createPaymentIntent(createPaymentIntentDto, userId) {
        try {
            const { amount, items, shippingAddress } = createPaymentIntentDto;
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: "usd",
                payment_method_types: ["card"],
                metadata: {
                    userId,
                    itemCount: items.length,
                    products: JSON.stringify(items),
                    shippingAddress: JSON.stringify(shippingAddress),
                },
                description: `Order from user ${userId} with ${items.length} item(s)`,
            });
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PaymentService);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),
/* 50 */
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
const payment_service_1 = __webpack_require__(48);
const create_payment_intent_dto_1 = __webpack_require__(51);
const jwt_auth_guard_1 = __webpack_require__(19);
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
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)("create-intent"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_payment_intent_dto_1.CreatePaymentIntentDto !== "undefined" && create_payment_intent_dto_1.CreatePaymentIntentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Get)(":paymentIntentId/status"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Post)(":paymentIntentId/confirm"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)(":paymentIntentId/refund"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("paymentIntentId")),
    __param(1, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [typeof (_a = typeof payment_service_1.PaymentService !== "undefined" && payment_service_1.PaymentService) === "function" ? _a : Object])
], PaymentController);


/***/ }),
/* 51 */
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
exports.ConfirmPaymentDto = exports.CreatePaymentIntentDto = void 0;
const class_validator_1 = __webpack_require__(17);
class CreatePaymentIntentDto {
}
exports.CreatePaymentIntentDto = CreatePaymentIntentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePaymentIntentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], CreatePaymentIntentDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePaymentIntentDto.prototype, "shippingAddress", void 0);
class ConfirmPaymentDto {
}
exports.ConfirmPaymentDto = ConfirmPaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmPaymentDto.prototype, "paymentIntentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmPaymentDto.prototype, "paymentMethodId", void 0);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const common_1 = __webpack_require__(2);
const product_service_1 = __webpack_require__(53);
const product_controller_1 = __webpack_require__(54);
const database_module_1 = __webpack_require__(7);
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [product_service_1.ProductService],
        controllers: [product_controller_1.ProductController],
    })
], ProductModule);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                stock: data.stock,
                sellerId: data.sellerId,
                description: data.description || '',
                ecoScore: data.ecoScore || 0,
                category: data.category || 'other',
                processingFee: data.processingFee || 0,
            },
            include: { seller: true },
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
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProductService);


/***/ }),
/* 54 */
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
exports.ProductController = void 0;
const common_1 = __webpack_require__(2);
const product_service_1 = __webpack_require__(53);
const jwt_auth_guard_1 = __webpack_require__(19);
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async findAll() {
        return this.productService.findAll();
    }
    async findOne(id) {
        const product = await this.productService.findOne(id);
        return { product };
    }
    async create(body, req) {
        return this.productService.create({
            ...body,
            sellerId: req.user.id,
        });
    }
    async update(id, body) {
        return this.productService.update(id, body);
    }
    async delete(id) {
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
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "delete", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _a : Object])
], ProductController);


/***/ }),
/* 55 */
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
const product_approval_service_1 = __webpack_require__(56);
const product_approval_controller_1 = __webpack_require__(57);
const database_module_1 = __webpack_require__(7);
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
/* 56 */
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
const prisma_service_1 = __webpack_require__(8);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductApprovalController = void 0;
const common_1 = __webpack_require__(2);
const product_approval_service_1 = __webpack_require__(56);
const jwt_auth_guard_1 = __webpack_require__(19);
const admin_guard_1 = __webpack_require__(58);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof product_approval_service_1.ProductApprovalService !== "undefined" && product_approval_service_1.ProductApprovalService) === "function" ? _a : Object])
], ProductApprovalController);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminGuard = void 0;
const common_1 = __webpack_require__(2);
let AdminGuard = class AdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.user && request.user.role === "admin";
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);


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
exports.SellerKycModule = void 0;
const common_1 = __webpack_require__(2);
const seller_kyc_service_1 = __webpack_require__(60);
const seller_kyc_controller_1 = __webpack_require__(61);
const database_module_1 = __webpack_require__(7);
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
/* 60 */
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
const prisma_service_1 = __webpack_require__(8);
let SellerKycService = class SellerKycService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitKycDocuments(userId, documents) {
        return await this.prisma.seller.update({
            where: { userId },
            data: { kycStatus: "PENDING" },
        });
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
/* 61 */
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
exports.KycAdminController = exports.SellerKycController = void 0;
const common_1 = __webpack_require__(2);
const seller_kyc_service_1 = __webpack_require__(60);
const jwt_auth_guard_1 = __webpack_require__(19);
const current_user_decorator_1 = __webpack_require__(20);
let SellerKycController = class SellerKycController {
    constructor(service) {
        this.service = service;
    }
    async submitDocuments(user, documents) {
        return this.service.submitKycDocuments(user.id, documents);
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
    __metadata("design:paramtypes", [Object, Object]),
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
    __metadata("design:paramtypes", [typeof (_b = typeof seller_kyc_service_1.SellerKycService !== "undefined" && seller_kyc_service_1.SellerKycService) === "function" ? _b : Object])
], KycAdminController);


/***/ }),
/* 62 */
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
const delivery_management_service_1 = __webpack_require__(63);
const delivery_management_controller_1 = __webpack_require__(64);
const database_module_1 = __webpack_require__(7);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeliveryManagementService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
let DeliveryManagementService = class DeliveryManagementService {
    constructor(prisma) {
        this.prisma = prisma;
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
    async updateDeliveryStatus(orderId, status, trackingId) {
        const product = await this.prisma.product.findFirst({
            where: { orders: { some: { id: orderId } } },
        });
        if (!product)
            throw new Error('Product not found for this order');
        const data = { deliveryStatus: status, updatedAt: new Date() };
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: status === 'DELIVERED' ? 'DELIVERED' : 'PENDING',
                deliveryTrackingId: trackingId || product.id,
                deliveredAt: status === 'DELIVERED' ? new Date() : null,
            },
        });
        await this.prisma.product.update({
            where: { id: product.id },
            data,
        });
        return order;
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
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DeliveryManagementService);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeliveryManagementController = void 0;
const common_1 = __webpack_require__(2);
const delivery_management_service_1 = __webpack_require__(63);
const jwt_auth_guard_1 = __webpack_require__(19);
const current_user_decorator_1 = __webpack_require__(20);
const client_1 = __webpack_require__(9);
let DeliveryManagementController = class DeliveryManagementController {
    constructor(service) {
        this.service = service;
    }
    async getOrders(user, status) {
        const statusEnum = status ? client_1.DeliveryStatus[status] : undefined;
        return this.service.getOrdersByStatus(user.id, statusEnum);
    }
    async updateStatus(orderId, body) {
        const status = client_1.DeliveryStatus[body.status];
        return this.service.updateDeliveryStatus(orderId, status, body.trackingId);
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
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
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
    __metadata("design:paramtypes", [typeof (_a = typeof delivery_management_service_1.DeliveryManagementService !== "undefined" && delivery_management_service_1.DeliveryManagementService) === "function" ? _a : Object])
], DeliveryManagementController);


/***/ }),
/* 65 */
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
const message_moderation_service_1 = __webpack_require__(66);
const message_moderation_controller_1 = __webpack_require__(67);
const database_module_1 = __webpack_require__(7);
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
/* 66 */
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
exports.MessageModerationService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(8);
let MessageModerationService = class MessageModerationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async flagMessage(messageId, reason) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message)
            throw new Error('Message not found');
        return {
            messageId,
            flagged: true,
            reason,
            flaggedAt: new Date()
        };
    }
    async getFlaggedMessages() {
        const messages = await this.prisma.message.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } }
            },
        });
        return messages;
    }
    async resolveFlag(messageId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message)
            throw new Error('Message not found');
        return {
            messageId,
            resolved: true,
            resolvedAt: new Date()
        };
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
            user
        };
    }
    async getAbuseReports() {
        const messages = await this.prisma.message.findMany({
            take: 100,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
                sender: { select: { name: true, email: true } },
                receiver: { select: { name: true, email: true } }
            },
        });
        return messages;
    }
};
exports.MessageModerationService = MessageModerationService;
exports.MessageModerationService = MessageModerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MessageModerationService);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageModerationController = void 0;
const common_1 = __webpack_require__(2);
const message_moderation_service_1 = __webpack_require__(66);
const jwt_auth_guard_1 = __webpack_require__(19);
const admin_guard_1 = __webpack_require__(58);
let MessageModerationController = class MessageModerationController {
    constructor(service) {
        this.service = service;
    }
    async flagMessage(messageId, body) {
        return this.service.flagMessage(messageId, body.reason);
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
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof message_moderation_service_1.MessageModerationService !== "undefined" && message_moderation_service_1.MessageModerationService) === "function" ? _a : Object])
], MessageModerationController);


/***/ }),
/* 68 */
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
const analytics_service_1 = __webpack_require__(69);
const analytics_controller_1 = __webpack_require__(70);
const database_module_1 = __webpack_require__(7);
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
/* 69 */
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
const prisma_service_1 = __webpack_require__(8);
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
        const products = await this.prisma.product.count();
        return {
            ecoFriendlyProducts: Math.floor(products * 0.3),
            carbonSaved: products * 5,
            treesPlanted: Math.floor(products / 2),
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AnalyticsService);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsController = void 0;
const common_1 = __webpack_require__(2);
const analytics_service_1 = __webpack_require__(69);
const jwt_auth_guard_1 = __webpack_require__(19);
const admin_guard_1 = __webpack_require__(58);
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
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('admin/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
    },
});


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
const swagger_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
    app.enableCors({
        origin: "*",
        credentials: true,
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
    console.log(`? API running on port ${port}`);
    console.log(`? Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap().catch(err => {
    console.error("Failed to start:", err.message);
    process.exit(1);
});

})();

/******/ })()
;