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
            if (!origin ||
                origin.indexOf('localhost') !== -1 ||
                origin.indexOf('127.0.0.1') !== -1 ||
                origin.indexOf('[::1]') !== -1 ||
                (frontendUrl && origin === frontendUrl)) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
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