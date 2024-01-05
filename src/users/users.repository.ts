import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Ebook, Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
    
    constructor(private readonly prisma: PrismaService) { }

    create(createUserDto: CreateUserDto) {
        const { name, email, ebooks } = createUserDto;

        const userCreateInput: Prisma.UserCreateInput = {
            name,
            email,
            ebooks: {
                create: ebooks.map((ebooksId) => ({ ebookId: ebooksId })),
            },
        };

        return this.prisma.user.create({
            data: userCreateInput,
        });
    }

    findAll() {
        return this.prisma.user.findMany();
    }

    findAllWithEbooks() {
        return this.prisma.user.findMany({
            include: {
                ebooks: {
                    select: {
                        ebookId: true,
                    },
                },
            },
        });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }

    findOneUserWithEbooks(id: number) {
        return this.prisma.user.findMany({
            where: { id },
            include: {
                ebooks: {
                    select: {
                        ebookId: true,
                    },
                },
            },
        })
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findByEbooks(ebooks: Array<number>) {
        if(ebooks.length === 0){
            return false;
        }

        for (const id_ebook of ebooks) {
            const ebook = await this.prisma.ebook.findUnique({
                where: { id: id_ebook }
            });
            if (!ebook)
            {
                return false;
            }

        }
        return true;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.prisma.userEbook.deleteMany({
            where: { userId: id },
        });

        return this.prisma.user.update({
            where: { id: id },
            data: {
                name: updateUserDto.name,
                email: updateUserDto.email,
                ebooks: {
                    create: updateUserDto.ebooks.map((ebooksId) => ({ ebookId: ebooksId })),
                },
            },
        })
    }

    async remove(id: number) {
        await this.prisma.userEbook.deleteMany({
            where: { userId: id },
        });

        return this.prisma.user.delete({
            where:{ id },
        })
    }
}
