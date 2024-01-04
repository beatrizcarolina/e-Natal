import { Injectable } from '@nestjs/common';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EbooksRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(createEbookDto: CreateEbookDto) {
        return this.prisma.ebook.create({
            data: createEbookDto
        });
    }

    findAll() {
        return this.prisma.ebook.findMany();
    }

    findOne(id: number) {
        return this.prisma.ebook.findUnique({
            where: { id }
        });
    }

    findByTitleAndAuthor(title: string, author: string) {
        return this.prisma.ebook.findMany({
            where: {
                title,
                author
            }
        })
    }

    findWithWishlist(id: number) {
        return this.prisma.userEbook.findMany({
            where: { ebookId: id },
        });
    }

    update(id: number, updateEbookDto: UpdateEbookDto) {
        return this.prisma.ebook.update({
            where: { id },
            data: updateEbookDto
        });
    }

    remove(id: number) {
        return this.prisma.ebook.delete({
            where: { id }
        });
    }
}