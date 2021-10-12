import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private isProduction() {
    return process.env.NODE_ENV === 'production' ? true : false;
  }

  private getTlsOptions() {
    return this.isProduction()
      ? {
          rejectUnauthorized: false,
        }
      : false;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: !this.isProduction(),
      autoLoadEntities: true,
      ssl: this.getTlsOptions(),
    };
  }
}
