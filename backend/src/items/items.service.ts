import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ItemsService {
  private items: any[] = [];
  private users: any[] = [];

  signup(userData: any) {
    const user = { id: Date.now(), ...userData };
    this.users.push(user);
    return { message: 'Success' };
  }

  signin(credentials: any) {
    const user = this.users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) throw new UnauthorizedException();
    return { token: 'fake-jwt-token', user: { name: user.name, email: user.email } };
  }

  findAll() {
    return this.items;
  }

  create(data: any) {
    const newItem = {
      id: Date.now(),
      ...data,
      priority: data.priority || 'low',
      status: 'pending',
      createdAt: new Date(),
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, data: any) {
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