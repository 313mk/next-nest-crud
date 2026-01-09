import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  
  @Post('signup')
  signup(@Body() data: any) {
    return this.itemsService.signup(data);
  }

  @Post('signin')
  signin(@Body() data: any) {
    return this.itemsService.signin(data);
  }

  
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.itemsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    
    return this.itemsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
   
    return this.itemsService.remove(id);
  }
}
