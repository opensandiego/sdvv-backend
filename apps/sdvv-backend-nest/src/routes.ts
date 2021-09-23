import { Routes } from '@nestjs/core';
import { ProcessModule } from './task.process/process.module';
import { UpdateModule } from './task.update/update.module';

export const routes: Routes = [
  {
    path: 'task',
    children: [
      {
        path: '/update',
        module: UpdateModule,
      },
      {
        path: '/process',
        module: ProcessModule,
      },
    ],
  },
];
