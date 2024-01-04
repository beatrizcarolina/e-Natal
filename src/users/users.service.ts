import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateEbookDto } from 'src/ebooks/dto/update-ebook.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {  }

  async create(createUserDto: CreateUserDto) {
    const { email, ebooks } = createUserDto;

    const user = await this.repository.findByEmail(email);
    if(user) throw new HttpException(`This email is already registered!`, HttpStatus.BAD_REQUEST);

    const ebook = await this.repository.findByEbooks(ebooks);
    if(!ebook) throw new HttpException(`Ebook not found`, HttpStatus.NOT_FOUND);
    
    return this.repository.create(createUserDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    if(id < 0 || typeof id !== "number") throw new HttpException(`ID is invalid!`, HttpStatus.BAD_REQUEST);
    
    const user = await this.repository.findOneUserWithEbooks(id);
    if(!user) throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, ebooks } = updateUserDto;
    const user = await this.repository.findByEmail(email);
    if(!user) throw new HttpException(`User not found!`, HttpStatus.NOT_FOUND);

    if(user.id !== id) throw new HttpException(`ID not corresponding for user!`, HttpStatus.NOT_FOUND);

    const ebook = await this.repository.findByEbooks(ebooks);
    if(!ebook) throw new HttpException(`Ebook not found`, HttpStatus.NOT_FOUND);

    return this.repository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.repository.findOne(id);
    if(!user) throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);

    return this.repository.remove(id);
  }
}