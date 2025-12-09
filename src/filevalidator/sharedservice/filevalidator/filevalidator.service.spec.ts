import { Test, TestingModule } from '@nestjs/testing';
import { FilevalidatorService } from './filevalidator.service';

describe('FilevalidatorService', () => {
  let service: FilevalidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilevalidatorService],
    }).compile();

    service = module.get<FilevalidatorService>(FilevalidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
