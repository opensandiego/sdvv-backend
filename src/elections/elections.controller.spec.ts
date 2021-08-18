import { Test, TestingModule } from '@nestjs/testing';
import { ElectionsController } from './elections.controller';

describe('ElectionsController', () => {
  let controller: ElectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectionsController],
    }).compile();

    controller = module.get<ElectionsController>(ElectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
