"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    const frontendUrl = process.env.FRONTEND_URL;
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:5173',
                'http://localhost:3000',
                process.env.FRONTEND_URL,
            ];
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin) ||
                origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
            console.log('❌ Blocked by CORS:', origin);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const port = process.env.PORT || 3000;
    console.log('Current __dirname:', __dirname);
    console.log('Uploads path:', (0, path_1.join)(process.cwd(), 'uploads'));
    console.log('Uploads exists:', require('fs').existsSync((0, path_1.join)(process.cwd(), 'uploads')));
    await app.listen(port);
    console.log(`Backend server listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map