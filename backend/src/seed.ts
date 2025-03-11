import { CommandFactory } from 'nest-commander';
import { SeedModule } from './database/seeders/seed.module';

async function bootstrap() {
  await CommandFactory.run(SeedModule);
}

bootstrap();
