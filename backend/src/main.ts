import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // THIS LINE IS THE MOST IMPORTANT:
  app.enableCors(); 
  
  // MAKE SURE THIS IS 3001:
  await app.listen(3001); 
}
bootstrap();