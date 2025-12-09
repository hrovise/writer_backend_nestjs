import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, UserModel } from 'src/text/schemas/user.schema';
import type { DocumentType } from '@typegoose/typegoose';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { Model } from 'mongoose';
import { userRole } from 'src/shared/constExpressions/expressions';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/text/dto/userDto';


@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel)private userModel:Model<UserDocument>, private jwtService: JwtService ) {}

  
  async validate({password,email}:UserDto): Promise<any|null> {
   
  
    const user: DocumentType<UserModel>|null = await this.userModel.findOne({ email }).exec();
   
     if (!user) {
      throw new Error('User not found');
    }
    if (user) {
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
if (!isMatch) {
      throw new Error('Invalid password');
    }
     
     if(isMatch){
        const userObject = user.toObject();
        const { passwordHash, ...result } = userObject;
          
        return result;
     }
    
   
     
      } else 
        return null;
   
    
  }
   async login(user: any) {
    const payload = { role: user.role, sub: user._id, email:user.email };
 
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}