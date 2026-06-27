"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const users = await prisma.user.findMany({
        where: {
            role: { in: [client_1.Role.PROJECT_COORDINATOR, client_1.Role.ADMIN] }
        },
        select: { id: true, name: true, email: true, role: true, domain: true }
    });
    console.log('ADMINS AND COORDINATORS:');
    console.log(JSON.stringify(users, null, 2));
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=list-coordinators.js.map