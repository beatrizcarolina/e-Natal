import { CreateEbookDto } from "src/ebooks/dto/create-ebook.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export class EbookFactory {
    private title: string;
    private description: string;
    private author: string;
    private pdf: string;

    constructor(private readonly prisma: PrismaService) { }

    withTitle(title: string) {
        this.title = title;
        return this;
    }

    withDescription(description: string) {
        this.description = description;
        return this;
    }

    withAuthor(author: string) {
        this.author = author;
        return this;
    }

    withPDF(pdf: string) {
        this.pdf = pdf;
        return this;
    }

    /*build(): CreateEbookDto {
        return{
            title: this.title,
            description: this.description,
            author: this.author,
            pdf: this.pdf
        }
    }*/

    randomInfo() {
        return {
            title: faker.lorem.word(3),
            description: faker.lorem.paragraph(),
            author: faker.person.fullName(),
            pdf: `${faker.system.commonFileName()}.pdf`
        }
    }

    async persist() {
        const ebook = this.randomInfo();
        return await this.prisma.ebook.create({
            data: ebook
        })
    }

}