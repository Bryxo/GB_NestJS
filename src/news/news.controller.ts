import { Controller, Get, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { NewsService, News, NewsEdit  } from './news.service';
import { CommentsService, Comment } from './comments/comments.service';
import { renderNewsAll } from 'src/views/news/news-all';
import { renderTemplate } from 'src/views/template';



@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService, 
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/api/:id')
  getNews(@Param('id') id: string): News {
    const idInt = parseInt(id);
    const news = this.newsService.findById(idInt);
    const comments = this.commentsService.find(idInt);

    return {
      ...news,
      comments,
    };
  }

  @Post("/api")
  createNews(@Body() news: News): News {
    return this.newsService.create(news); 
  } 

  @Post('/api/:id')
  editNews(@Param('id') id: string, @Body() news: News): string {
    const idInt = parseInt(id);
    const isEdited = this.newsService.edit(idInt, news); 
    return isEdited ? 'Новость отредактирована' : 'Новость не отредактирована - передан неверный id';
  } 

  @Delete('/api/:id')
  removeNews(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Новость удалена' : 'Новость не удалена - передан неверный id'
  } 

  @Get('/api/data/:all') //back
  getAll(): News[] {
    const news = this.newsService.findAll();
    return news;
  }

  @Get('/all') //front
  getAllView() {
    const news = this.newsService.findAll();
    const content = renderNewsAll(news);
    return renderTemplate(content, {title: "Список новостей", description: "Новости - ХОБОСТИ"});
  }





}
