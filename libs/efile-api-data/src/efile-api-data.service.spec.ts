import { Test, TestingModule } from '@nestjs/testing';
import { EfileApiDataService } from './efile-api-data.service';

describe('EfileApiDataService', () => {
  let service: EfileApiDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EfileApiDataService],
    }).compile();

    service = module.get<EfileApiDataService>(EfileApiDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
