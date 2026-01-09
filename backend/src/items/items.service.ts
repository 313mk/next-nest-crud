import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  private items: any[] = [];

  create(createItemDto: any) {
    const newItem = { id: Date.now(), ...createItemDto };
    this.items.push(newItem);
    return newItem;
  }

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    return this.items.find(item => item.id === +id);
  }

  // THIS IS THE MISSING METHOD THAT CAUSED YOUR ERROR:
  update(id: number, updateItemDto: any) {
    const index = this.items.findIndex(item => item.id === +id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updateItemDto };
      return this.items[index];
    }
    return null;
  }

  remove(id: number) {
    this.items = this.items.filter(item => item.id !== +id);
    return { deleted: true };
  }
}