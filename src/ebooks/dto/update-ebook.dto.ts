import { PartialType } from '@nestjs/mapped-types';
import { CreateEbookDto } from './create-ebook.dto';

export class UpdateEbookDto extends PartialType(CreateEbookDto) {
    constructor(params?: Partial<UpdateEbookDto>) {
        super();
        Object.assign(this, params);
    }
}
