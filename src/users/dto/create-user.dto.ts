import { IsArray, IsEmail, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, isNumber } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({
        message: "Name is required!"
    })
    name: string;

    @IsEmail()
    @IsNotEmpty({
        message: "Email is required!"
    })
    email: string;

    @IsNotEmpty({
        message: "Ebook is required!"
    })
    @IsArray()
    ebooks: number[];

    constructor(params?: Partial<CreateUserDto>) {
        Object.assign(this, params);
    }
}
