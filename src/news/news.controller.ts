import { Controller, Get, Param, Body, Post, Put, Delete,  Res,  UseInterceptors,  UploadedFile, } from '@nestjs/common';
import { NewsService, News, NewsEdit  } from './news.service';
import { CommentsService, Comment } from './comments/comments.service';
import { renderNewsAll } from 'src/views/news/news-all';
import { renderTemplate } from 'src/views/template';
import { renderNewsDetail } from '../views/news/news-detail';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'utils/HelperFileLoader';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;


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

  @Get('/detail/:id')
  getDetailView(@Param('id') id: string) {
    const inInt = parseInt(id);
    const news = this.newsService.findById(inInt);
    const comments = this.commentsService.find(inInt);
    const content = renderNewsDetail(news, comments);

    return renderTemplate(content, {
      title: news.title,
      description: news.description,
    });
  }

  @Post("/api")
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  create(@Body() news: CreateNewsDto, @UploadedFile() cover: Express.Multer.File): News {
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    return this.newsService.create(news); 
  } 

  @Post('/api/:id')
  editNews(@Param('id') id: string, @Body() news: EditNewsDto): string {
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
