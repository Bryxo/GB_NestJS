import { Controller, Get, Param, Body, Post, Put, Delete,  Res,  UseInterceptors,  UploadedFile, HttpException, HttpStatus, Render } from '@nestjs/common';
import { NewsService, News, NewsEdit  } from './news.service';
import { CommentsService } from './comments/comments.service';
import { renderTemplate } from 'src/views/template';
import { renderNewsDetail } from '../views/news/news-detail';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../../utils/HelperFileLoader';
import { MailService } from '../mail/mail.service';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;


@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService, 
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
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
  
  async create(@Body() news: CreateNewsDto,  @UploadedFile() cover) : Promise<News> {
    const fileExtension = cover.originalname.split('.').reverse()[0];
    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Неверный формат данных',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    const createdNews = this.newsService.create(news);
    await this.mailService.sendNewNewsForAdmins(
      [
        'ivanivii@yandex.ru',
        'ivanivii@gmail.com',
        'ivanivii@mail.ru',
        'ivanivii@rambler.ru',
      ],
      createdNews,
    );
    return createdNews;
  } 

  @Post('/api/:id')
  editNews(@Param('id') id: string, @Body() news: EditNewsDto): string {
    const idInt = parseInt(id);
    const isEdited = this.newsService.edit(idInt, news); 
    return isEdited ? 'Новость отредактирована' : 'Новость не отредактирована - передан неверный id';
  } 

  @Delete('/api/:id') //put
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
  @Render('news-list')
  getAllView() {
    const news = this.newsService.findAll();
    // const content = renderNewsAll(news);
    // return renderTemplate(content, {title: "Список новостей", description: "Новости - ХОБОСТИ"});
    return { news, title: 'Список новостей!' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }
}