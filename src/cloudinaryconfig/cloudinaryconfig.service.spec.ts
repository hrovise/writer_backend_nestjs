import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryConfigService } from './cloudinaryconfig.service';
import { ConfigService } from '@nestjs/config';

describe('CloudinaryConfigService', () => {
  let service: CloudinaryConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CloudinaryConfigService,
          useValue: {
      getConfig: jest.fn(() => 'mock config value'),  
      },
        },
         { 
          provide: ConfigService,
           useValue: {
            getOrThrow: jest.fn(() => 'mock config value')
           }
           }, 
        ],
    }).compile();

    service = module.get<CloudinaryConfigService>(CloudinaryConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
