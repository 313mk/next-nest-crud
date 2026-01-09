import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  priority: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);