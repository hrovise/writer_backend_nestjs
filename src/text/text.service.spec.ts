import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from './text.service';
import { getModelToken } from '@m8a/nestjs-typegoose';
import { ConfigService } from '@nestjs/config';

describe('TextService', () => {
  let service: TextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextService,
       {
    provide: getModelToken('UserModel'), 
    useValue: {                         
      find: jest.fn(),
      create: jest.fn(),
      exec: jest.fn(),
    }
  },
    { 
            provide: ConfigService,
             useValue: {
              getOrThrow: jest.fn(() => 'mock config value')
             }
             }, 
      ],
      
    }).compile();

    service = module.get<TextService>(TextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
