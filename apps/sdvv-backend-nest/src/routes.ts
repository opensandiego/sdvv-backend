import { Routes } from '@nestjs/core';
import { ProcessModule } from './task.process/process.module';

export const routes: Routes = [
  {
    path: 'task',
    children: [
      {
        path: '/process',
        module: ProcessModule,
      },
    ],
  },
];
