import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    constructor(params?: Partial<UpdateUserDto>) {
        super();
        Object.assign(this, params);
    }
}
