"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(name, email, role, password, domain) {
        if (role === client_1.Role.ADMIN) {
            throw new common_1.ConflictException('Admins must be added by an Administrator.');
        }
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('User email already exists');
        }
        let normalizedDomain = domain ? domain.trim() : 'Full Stack';
        if (/^(gen\s*ai|generative\s*ai)$/i.test(normalizedDomain)) {
            normalizedDomain = 'Generative AI';
        }
        else if (/^(full\s*stack)$/i.test(normalizedDomain)) {
            normalizedDomain = 'Full Stack';
        }
        else if (/^(data\s*science)$/i.test(normalizedDomain)) {
            normalizedDomain = 'Data Science';
        }
        else if (/^(machine\s*learning)$/i.test(normalizedDomain)) {
            normalizedDomain = 'Machine Learning';
        }
        else if (/^(cyber\s*security)$/i.test(normalizedDomain)) {
            normalizedDomain = 'Cyber Security';
        }
        else if (/^(digital\s*marketing)$/i.test(normalizedDomain)) {
            normalizedDomain = 'Digital Marketing';
        }
        const activeDomain = await this.prisma.domain.findFirst({
            where: {
                name: {
                    equals: normalizedDomain,
                    mode: 'insensitive',
                },
            },
        });
        const finalDomain = activeDomain ? activeDomain.name : normalizedDomain;
        const defaultPassword = password || 'welcome123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                role: role, // Support both INTERN and PROJECT_COORDINATOR
                domain: finalDomain,
                password: hashedPassword,
                isApproved: role === client_1.Role.PROJECT_COORDINATOR ? true : false, // Project coordinators approved by default, Interns require admin approval
            },
        });
        // Auto-enroll matching domain courses for interns only
        if (user.role === client_1.Role.INTERN) {
            const courses = await this.prisma.course.findMany({
                where: { domain: user.domain || 'Full Stack' },
            });
            for (const course of courses) {
                await this.prisma.enrollment.upsert({
                    where: {
                        studentId_courseId: {
                            studentId: user.id,
                            courseId: course.id,
                        },
                    },
                    update: {},
                    create: {
                        studentId: user.id,
                        courseId: course.id,
                    },
                }).catch(() => { });
            }
            // Notify all admins of the new intern registration
            const admins = await this.prisma.user.findMany({
                where: { role: client_1.Role.ADMIN },
            });
            for (const admin of admins) {
                await this.prisma.notification.create({
                    data: {
                        userId: admin.id,
                        title: 'New Intern Registered',
                        message: `A new intern "${user.name}" has registered and requires approval.`,
                        type: 'new_intern',
                        entityId: user.id,
                    },
                }).catch(() => { });
            }
        }
        const { password: _, ...result } = user;
        return result;
    }
    async login(emailOrUsername, pass) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                    { employeeId: emailOrUsername },
                ],
            },
        });
        if (!user) {
            console.warn(`[AuthService.login] Authentication failed: User not found for identifier "${emailOrUsername}"`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            console.warn(`[AuthService.login] Authentication failed: Password mismatch for user "${user.email}"`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.role === client_1.Role.INTERN && !user.isApproved) {
            console.warn(`[AuthService.login] Authentication failed: Intern account "${user.email}" is pending admin approval`);
            throw new common_1.UnauthorizedException('Your account is pending admin approval');
        }
        const tokens = await this.generateTokens(user.id);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _, refreshToken: __, ...userData } = user;
        return {
            user: userData,
            ...tokens,
        };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        if (user.role === client_1.Role.INTERN && !user.isApproved) {
            throw new common_1.UnauthorizedException('Your account is pending admin approval');
        }
        const tokens = await this.generateTokens(user.id);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _, refreshToken: __, ...userData } = user;
        return {
            user: userData,
            ...tokens,
        };
    }
    async generateTokens(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = {
            sub: user.id,
            username: user.username || user.email,
            role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET ||
                'super-secret-access-token-key-12345',
            expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync({ sub: userId }, {
            secret: process.env.JWT_REFRESH_SECRET ||
                'super-secret-refresh-token-key-67890',
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashed = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashed },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map