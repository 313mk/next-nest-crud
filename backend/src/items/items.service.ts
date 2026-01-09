import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './item.schema';

@Injectable()
export class ItemsService {
  // still in-memory (same as earlier version)
  private users: any[] = [];

  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<Item>,
  ) {}

  // ---------- AUTH ----------
  signup(userData: any) {
    const user = { id: Date.now(), ...userData };
    this.users.push(user);
    return { success: true };
  }

  signin(credentials: any) {
    const user = this.users.find(
      (u) =>
        u.email === credentials.email &&
        u.password === credentials.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  // ---------- ITEMS ----------
  async findAll() {
    return this.itemModel.find().exec();
  }

  async create(data: any) {
    const newItem = new this.itemModel({
      ...data,
      completed: false,
      createdAt: new Date(),
    });

    return newItem.save();
  }

  async update(id: string, data: any) {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException('Item not found');
    }

    return updatedItem;
  }

  async remove(id: string) {
    const deletedItem = await this.itemModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedItem) {
      throw new NotFoundException('Item not found');
    }

    return { success: true };
  }
}
