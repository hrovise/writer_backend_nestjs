import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryConfigService } from 'src/cloudinaryconfig/cloudinaryconfig.service';

describe('TextController', () => {
  let controller: TextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
        providers: [
    {
      provide: TextService, 
      useValue: {
        findAll: jest.fn(() => []),
        create: jest.fn(()=>({  text: 'text',
      length: 100,
      currentPage:1,
      pageSize:50,
      message: 'ok',})),
      },
      
    },
     { 
          provide: ConfigService,
           useValue: {
            getOrThrow: jest.fn(() => 'mock config value')
           }
           }, 
   
    { provide: CloudinaryConfigService, useValue: {} }, 
  ],
    }).compile();

    controller = module.get<TextController>(TextController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
