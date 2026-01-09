import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://232501_db_user:test123@cluster0.4dpkkyl.mongodb.net/items_db?retryWrites=true&w=majority'
    ),
    ItemsModule,
  ],
})
export class AppModule {}