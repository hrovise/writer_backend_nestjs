import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextService } from './text.service';
import { GetNovelDto } from './dto/novelDto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as mammoth from 'mammoth';
import { DOCX, TXT } from 'src/shared/constExpressions/expressions';
import { Chunk } from './schemas/chunk.schema';
import * as fs from 'fs';
import * as path from 'path';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CloudinaryConfigService } from 'src/cloudinaryconfig/cloudinaryconfig.service';
import { JwtAuthAdminGuard } from 'src/auth/jswtauthadmin.quard';


export interface IChunk {
  text: string;
  length: number;
  index: number;
}

export interface ITextResponse {
  chunks: IChunk[];
  totalLengthText: number;
  chunksCount: number;
  title: string;
  genre: string;
}

@ApiTags('text')
@Controller('text')
export class TextController {
  constructor(
    private readonly textService: TextService,
 
    private readonly cloudinaryConfigService: CloudinaryConfigService
  ) { }

  @Get('chunk')
  @ApiOperation({ summary: 'Получить кусок текста' })
  @ApiParam({ name: 'textTitle', description: 'Тайтл текста' })
  @ApiParam({ name: 'chunkIndex', description: 'Номер чанка' })
  @ApiResponse({
    status: 200,
    description: 'Успешно найден чанк',
    schema: {
      example: {
        chunks: 4,
        totalLengthText: 'всего текста',
        chunksCount: 'количество чанков',
        title: 'тайтл',
        genre: 'жанр',
      },
    },
  })
  async getChunk(
    @Query('textTitle') textTitle: string,
    @Query('chunkIndex') chunkIndex: string,
  ): Promise<ITextResponse> {
    return this.textService.getChunkByIndex(textTitle, Number(chunkIndex));
  }

  @ApiBearerAuth() 
  @UseGuards(JwtAuthAdminGuard)
  @Post('createNew')
  @ApiOperation({ summary: 'Создает новый текст с файлами' })

// 2. Обязательно: говорим, что принимаем форму с файлами
@ApiConsumes('multipart/form-data')

// 3. Описываем ТЕЛО запроса вручную (schema)
@ApiBody( {
   type: GetNovelDto
  
})
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
    }),
  )
  async uploadNovel(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('title') title: string,
    @Body('genre') genre: string,
  ) {
    let fullText: Chunk[];
    let lengthText: number;
    let relativePath = '';

    if (!files) throw new BadRequestException('File is required');
    if (!title) throw new BadRequestException('Title is required');

    const textFile = files.find((f) => f.fieldname === 'file');
    const imageFile = files.find((f) => f.mimetype.includes('image'));
    let srcImg = '';
    if (imageFile) {
   
      srcImg = await this.cloudinaryConfigService.uploadImageBuffer(imageFile); 
    }

    if (!textFile) throw new BadRequestException('Text file is required');
    const type = await this.textService.checkFile(textFile.buffer);

    if (type == DOCX) {
      const { value: full } = await mammoth.extractRawText({
        buffer: textFile.buffer,
      });
      fullText = this.textService.chunkText(full);
      lengthText = full.length;
    } else if (type == TXT) {
      fullText = this.textService.chunkText(textFile.buffer.toString('utf-8'));
      lengthText = textFile.buffer.toString('utf-8').length;
    } else {
      throw new BadRequestException('File is unknown');
    }

  

    const novel = await this.textService.create({
      title,
      chunks: fullText,
      chunksCount: fullText.length,
      totalLengthText: lengthText,
      srcImg,
      genre,
    });

    return novel;
  }

  @Get('getText')
  
  async getText(@Query() query: GetNovelDto) {
    return this.textService.getNovel(query);
  }

  @Get('titles')
   @ApiOperation({ summary: 'Получить названия текстов' })
  @ApiParam({ name: 'textTitle', description: 'Тайтл текста' })
  @ApiParam({ name: 'chunkIndex', description: 'Номер чанка' })
  @ApiResponse({
    status: 200,
    description: 'Успешно найден чанк',
    schema: {
      example: {
        chunks: 4,
        totalLengthText: 'всего текста',
        chunksCount: 'количество чанков',
        title: 'тайтл',
        genre: 'жанр',
      },
    },
  })
  async getAllTitles() {
    return this.textService.getAllTitles();
  }

  @UseGuards(JwtAuthAdminGuard)
  @Post('update/:id')
  @UseInterceptors(FileInterceptor('imageFile'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
 

    try {
   

   const  srcImg = await this.cloudinaryConfigService.uploadImageBuffer(image); 

      await this.textService.update(id, { srcImg });

      return { message: 'Image updated successfully', srcImg };
    } catch (err) {
      console.error('Error saving image:', err);
      throw new InternalServerErrorException('Error while saving image');
    }
  }

  @UseGuards(JwtAuthAdminGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.textService.delete(id);
  }
}
