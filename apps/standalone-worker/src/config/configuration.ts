import { registerAs } from '@nestjs/config';

export default registerAs('root', () => ({
  TESTING_MODE: process.env.TESTING_MODE.toLocaleUpperCase() === 'TRUE',
}));
