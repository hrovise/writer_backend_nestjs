import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryConfigService } from './cloudinaryconfig.service';

describe('ClodinaryconfigService', () => {
  let service: CloudinaryConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryConfigService],
    }).compile();

    service = module.get<CloudinaryConfigService>(CloudinaryConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
