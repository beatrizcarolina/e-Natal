import { PrismaService } from "src/prisma/prisma.service";

export class E2EUtils {
    static async cleanDb(prisma: PrismaService) {
        await prisma.ebook.deleteMany();
        await prisma.user.deleteMany();
    }
}