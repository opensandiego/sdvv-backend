import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCommandController } from './update-command.controller';
import { UpdateCommandService } from './update-command.service';

describe('UpdateCommandController', () => {
  let updateCommandController: UpdateCommandController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UpdateCommandController],
      providers: [UpdateCommandService],
    }).compile();

    updateCommandController = app.get<UpdateCommandController>(UpdateCommandController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(updateCommandController.getHello()).toBe('Hello World!');
    });
  });
});
