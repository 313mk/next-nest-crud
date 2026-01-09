import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ItemsService {
  private items: any[] = [];

  findAll() {
    return this.items;
  }

  create(data: { name: string; description: string }) {
    const newItem = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, data: { name?: string; description?: string }) {
    const index = this.items.findIndex((item) => item.id === +id);
    if (index === -1) throw new NotFoundException();
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  remove(id: number) {
    this.items = this.items.filter((item) => item.id !== +id);
    return { success: true };
  }
}