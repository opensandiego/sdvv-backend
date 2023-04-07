import { Controller, Get } from '@nestjs/common';
import { UpdateCommandService } from './update-command.service';

@Controller()
export class UpdateCommandController {
  constructor(private readonly updateCommandService: UpdateCommandService) {}

  @Get()
  getHello(): string {
    return this.updateCommandService.getHello();
  }
}
