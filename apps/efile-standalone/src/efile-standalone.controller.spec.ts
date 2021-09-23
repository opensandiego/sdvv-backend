import { Test, TestingModule } from '@nestjs/testing';
import { EfileStandaloneController } from './efile-standalone.controller';
import { EfileStandaloneService } from './efile-standalone.service';

describe('EfileStandaloneController', () => {
  let efileStandaloneController: EfileStandaloneController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EfileStandaloneController],
      providers: [EfileStandaloneService],
    }).compile();

    efileStandaloneController = app.get<EfileStandaloneController>(EfileStandaloneController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(efileStandaloneController.getHello()).toBe('Hello World!');
    });
  });
});
