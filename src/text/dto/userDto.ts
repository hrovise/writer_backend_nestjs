import { getModelForClass } from "@typegoose/typegoose";
import { IsEmail, IsString } from "class-validator";


export class UserDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string
}


export const User = getModelForClass(UserDto);