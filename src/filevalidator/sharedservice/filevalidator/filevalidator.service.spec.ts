import { Test, TestingModule } from '@nestjs/testing';
import { FileValidatorService } from './filevalidator.service';

describe('FilevalidatorService', () => {
  let service: FileValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileValidatorService],
    }).compile();

    service = module.get<FileValidatorService>(FileValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
