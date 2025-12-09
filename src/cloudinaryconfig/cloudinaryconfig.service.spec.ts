import { Test, TestingModule } from '@nestjs/testing';
import { ClodinaryconfigService } from './cloudinaryconfig.service';

describe('ClodinaryconfigService', () => {
  let service: ClodinaryconfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClodinaryconfigService],
    }).compile();

    service = module.get<ClodinaryconfigService>(ClodinaryconfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
