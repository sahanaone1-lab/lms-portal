import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    role: Role,
    password?: string,
    domain?: string,
  ) {
    if (role === Role.ADMIN) {
      throw new ConflictException(
        'Admins must be added by an Administrator.',
      );
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('User email already exists');
    }

    let normalizedDomain = domain ? domain.trim() : 'Full Stack';
    if (/^(gen\s*ai|generative\s*ai)$/i.test(normalizedDomain)) {
      normalizedDomain = 'Generative AI';
    } else if (/^(full\s*stack)$/i.test(normalizedDomain)) {
      normalizedDomain = 'Full Stack';
    } else if (/^(data\s*science)$/i.test(normalizedDomain)) {
      normalizedDomain = 'Data Science';
    } else if (/^(machine\s*learning)$/i.test(normalizedDomain)) {
      normalizedDomain = 'Machine Learning';
    } else if (/^(cyber\s*security)$/i.test(normalizedDomain)) {
      normalizedDomain = 'Cyber Security';
    } else if (/^(digital\s*marketing)$/i.test(normalizedDomain)) {
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
        isApproved: role === Role.PROJECT_COORDINATOR ? true : false, // Project coordinators approved by default, Interns require admin approval
      },
    });

    // Auto-enroll matching domain courses for interns only
    if (user.role === Role.INTERN) {
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
        }).catch(() => {});
      }
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(emailOrUsername: string, pass: string) {
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      console.warn(`[AuthService.login] Authentication failed: Password mismatch for user "${user.email}"`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === Role.INTERN && !user.isApproved) {
      console.warn(`[AuthService.login] Authentication failed: Intern account "${user.email}" is pending admin approval`);
      throw new UnauthorizedException('Your account is pending admin approval');
    }

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userData } = user;
    return {
      user: userData,
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Access denied');
    }

    if (user.role === Role.INTERN && !user.isApproved) {
      throw new UnauthorizedException('Your account is pending admin approval');
    }

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userData } = user;
    return {
      user: userData,
      ...tokens,
    };
  }

  private async generateTokens(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const payload = {
      sub: user.id,
      username: user.username || user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      {
        secret:
          process.env.JWT_ACCESS_SECRET ||
          'super-secret-access-token-key-12345',
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'super-secret-refresh-token-key-67890',
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
