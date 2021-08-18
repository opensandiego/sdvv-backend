import { Test, TestingModule } from '@nestjs/testing';
import { ChartDataController } from './chart-data.controller';

describe('ChartDataController', () => {
  let controller: ChartDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChartDataController],
    }).compile();

    controller = module.get<ChartDataController>(ChartDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
