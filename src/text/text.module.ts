import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { TextModel } from './schemas/text.schema';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryConfigService } from 'src/cloudinaryconfig/cloudinaryconfig.service';


@Module({
  providers: [TextService, CloudinaryConfigService],
  imports: [
    
    
    TypegooseModule.forFeature([TextModel]), ConfigModule],
  controllers: [TextController],
})
export class TextModule {}
