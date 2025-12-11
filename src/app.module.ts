import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextModule } from './text/text.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { FileValidatorService } from './filevalidator/sharedservice/filevalidator/filevalidator.service';
import { CloudinaryConfigService } from './cloudinaryconfig/cloudinaryconfig.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import Joi from 'joi';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '.env',
       validationSchema: Joi.object({
    JWT_SECRET: Joi.string().required(), 
    CLOUDY_NAME: Joi.string().required(), 
    API_SECRET_CLOUD: Joi.string().required(), 
    API_KEY_CLOUD: Joi.string().required(), 
 CLIENT_URL: Joi.string().required(), 

  }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,  
    }]),
 JwtModule.registerAsync({ 
  global: true,
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '60m' }, 
      }),
      inject: [ConfigService], 
    }),
 
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    TextModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileValidatorService, CloudinaryConfigService, JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
}],
})
export class AppModule {}
