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
    const domains = await prisma.domain.findMany();
    const courses = await prisma.course.findMany({
        select: { id: true, title: true, domain: true, weeks: true }
    });
    console.log('DOMAINS:');
    console.log(JSON.stringify(domains, null, 2));
    console.log('COURSES:');
    console.log(JSON.stringify(courses, null, 2));
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=list-domains.js.map