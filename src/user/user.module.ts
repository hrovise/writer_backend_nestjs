import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModel } from 'src/text/schemas/user.schema';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
       providers: [AuthService],
      imports: [
        
       
        TypegooseModule.forFeature([UserModel]), ConfigModule],
      controllers: [UserController]
})
export class UserModule {



  
}
