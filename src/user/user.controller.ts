import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/text/dto/userDto';

@Controller('user')
export class UserController {
    constructor(private authService:AuthService){}


    @Post('/login')
    async login (@Body()loginDto:UserDto):Promise<{access_token:string}>{
     const user= await this.authService.validate(loginDto);
       if (!user) {
      throw new Error('Invalid credentials'); 
    }
      return await this.authService.login(user)
    }

}
