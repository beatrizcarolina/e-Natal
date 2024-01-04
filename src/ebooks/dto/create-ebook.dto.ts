import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEbookDto {
    @IsString()
    @IsNotEmpty({
        message: "Title is required!"
    })
    title: string;

    @IsString()
    @IsNotEmpty({
        message: "Author is required!"
    })
    author: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty({
        message: "PDF is required!"
    })
    pdf: string;

    constructor(params?: Partial<CreateEbookDto>) {
        Object.assign(this, params);
    }
}
