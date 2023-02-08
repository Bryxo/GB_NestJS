import { Controller, Get, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.interface';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {
  }

  @Get('/api/:id')
  getNews(@Param('id') id: string): News {
    const idInt = parseInt(id);
    return this.newsService.findById(idInt);
  }

  @Post()
  createNews(@Body() news: News): News {
    return this.newsService.create(news); 
  } 

  @Post('/:id')
  editNews(@Param('id') id: string, @Body() news: News): string {
    const idInt = parseInt(id);
    const isEdited = this.newsService.edit(idInt, news); 
    return isEdited ? 'Новость отредактирована' : 'Новость не отредактирована - передан неверный id';
  } 

  @Delete('/:id')
  removeNews(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Новость удалена' : 'Новость не удалена - передан неверный id'
  } 

  @Get('/:all')
  getAll(): News[] {
    const news = this.newsService.findAll();
    return news;
  }


}
