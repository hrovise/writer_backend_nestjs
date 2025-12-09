import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TextModel } from './schemas/text.schema';
import type { ModelType } from '@typegoose/typegoose/lib/types';
import { TextDto } from './dto/textDto';
import { GetNovelDto } from './dto/novelDto';
import { FilevalidatorService } from 'src/filevalidator/sharedservice/filevalidator/filevalidator.service';
import { UNKNOWN } from 'src/shared/constExpressions/expressions';
import { Chunk } from './schemas/chunk.schema';
import { ConfigService } from '@nestjs/config';

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
@Injectable()
export class TextService {
  limitChunks: number = 10000;
  constructor(
    @InjectModel(TextModel) private readonly textModel: ModelType<TextModel>,
    private configService: ConfigService,
  ) { }

  getExternalUrl(): string {
    
    const url =
      this.configService.getOrThrow<string>('EXTERNAL_URL') ;
    this.configService.getOrThrow<string>('EXTERNAL_URL') ;
    return url;
  }
  async create(data: Partial<TextModel> | TextDto): Promise<TextModel> {
    return this.textModel.create(data);
  }



  async update(
    id: string,
    data: { srcImg: string },
  ): Promise<TextModel | null> {
    
    if (typeof data.srcImg !== 'string') {
      throw new BadRequestException('Путь к изображению (srcImg) должен быть строкой');
    }

   
    return this.textModel
      .findByIdAndUpdate(id, { srcImg: data.srcImg }, { new: true })
      .exec();
  }
  async findAll(): Promise<TextModel[]> {
    return this.textModel.find().exec();
  }

  async findOne(id: string): Promise<TextModel | null> {
    return this.textModel.findById(id).exec();
  }

  async getNovel(dto: GetNovelDto) {
    const pageSize = Number(dto.pageSize) || 20;
    const currentPage = Number(dto.currentPage) || 1;
    const skip = pageSize * (currentPage - 1);

    const result = await this.textModel
      .aggregate([
        { $match: { title: dto.textTitle } },
        {
          $project: {
            text: { $slice: ['$text', skip, pageSize] },
            length: { $size: '$text' },
          },
        },
      ])
      .exec();

    if (!result[0]) throw new NotFoundException('Document not found');

    return {
      text: result[0].text,
      length: result[0].length,
      currentPage,
      pageSize,
      message: 'ok',
    };
  }

  async checkFile(filePath: Buffer) {
   
    const type = await FilevalidatorService.validateFile(filePath);
    if (type === UNKNOWN) {
      throw new BadRequestException('Неподдерживаемый тип файла');
    }

    return type;
  }

  chunkText(text: string, chunkSize = this.limitChunks): Chunk[] {
    const chunks: Chunk[] = [];
    for (let i = 0, index = 0; i < text.length; i += chunkSize, index++) {
      const slice = text.slice(i, i + chunkSize);
      chunks.push({ text: slice, length: slice.length, index });
    }
    return chunks;
  }

  async getChunkByIndex(
    textTitle: string,
    chunkIndex: number,
  ): Promise<ITextResponse> {
    const pipeline = [
      { $match: { title: textTitle } },
      {
        $project: {
          chunks: { $slice: ['$chunks', chunkIndex, 1] },
          totalLengthText: 1,
          chunksCount: 1,
          title: 1,
          genre: 1,
        },
      },
    ];

    const result = await this.textModel.aggregate(pipeline).exec();

    if (!result || result.length === 0) throw new Error('Text not found');
    if (!result || result.length === 0) throw new NotFoundException('Text not found');
    return {
      chunks: result[0].chunks,
      totalLengthText: result[0].totalLengthText,
      chunksCount: result[0].chunksCount,
      title: result[0].title,
      genre: result[0].genre,
    };
  }
  async getAllTitles(): Promise<Pick<TextModel, 'title' | 'srcImg'>[]> {
    return this.textModel
      .find({}, { title: 1, srcImg: 1, genre: 1, _id: 1 })
      .exec();
  }
  saveImageFile(img: Express.Multer.File | undefined) {
    if (!img) return undefined;

    
    return img.path;
  }

  async delete(id: string): Promise<void> {
  const result = await this.textModel.deleteOne({ _id: id });
  
  if (result.deletedCount === 0) {
     throw new NotFoundException('Not found');
  }
}
}
