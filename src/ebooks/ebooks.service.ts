import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { EbooksRepository } from './ebooks.repository';

@Injectable()
export class EbooksService {

  constructor(private readonly repository: EbooksRepository) {  }

  async create(createEbookDto: CreateEbookDto) {
    const { title, author } = createEbookDto;
    const ebook = await this.repository.findByTitleAndAuthor(title, author);
    console.log(ebook);
    if(ebook.length > 0) throw new HttpException(`Ebook with this information already existis`, HttpStatus.CONFLICT);

    return this.repository.create(createEbookDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    if(id < 0 || typeof id !== "number" ) throw new HttpException(`ID is invalid`, HttpStatus.BAD_REQUEST);

    const ebook = await this.repository.findOne(id);
    if(!ebook) throw new HttpException(`Ebook not found`, HttpStatus.NOT_FOUND);

    return ebook;
  }

  async update(id: number, updateEbookDto: UpdateEbookDto) {
    if(id < 0 || typeof id !== "number" ) throw new HttpException(`ID is invalid`, HttpStatus.BAD_REQUEST);

    const ebook = await this.repository.findOne(id);
    if(!ebook) throw new HttpException(`Ebook not found`, HttpStatus.NOT_FOUND);

    const ebookUpdated = await this.repository.findByTitleAndAuthor(updateEbookDto.title, updateEbookDto.author);
    if(ebookUpdated.length > 0) throw new HttpException(`Ebook with this information already existis`, HttpStatus.CONFLICT);

    return this.repository.update(id, updateEbookDto);
  }

  async remove(id: number) {
    const ebook = await this.repository.findOne(id);
    if(!ebook) throw new HttpException(`Ebook not found`, HttpStatus.NOT_FOUND);

    const users = await this.repository.findWithWishlist(id);
    if(users.length > 0) throw new HttpException(`Cannot delete ebook that is on a wishlist`, HttpStatus.FORBIDDEN);

    return this.repository.remove(id);
  }
}
