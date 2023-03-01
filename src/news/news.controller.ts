
import {  Body,  Controller,  Delete,  Get,  HttpException,  HttpStatus,  Param,  ParseIntPipe,  Post,  UploadedFile,  UseGuards,  UseInterceptors,} from '@nestjs/common';
import { NewsService, News, NewsEdit  } from './news.service';
import { CommentsService } from './comments/comments.service';
import { renderTemplate } from 'src/views/news/template';
import { renderNewsDetail } from '../views/news/news-detail';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../../utils/HelperFileLoader';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';

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
  async get(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
    const news = this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return news;
  }

  @Get('/detail/:id')
  @Render('news-detail')
  async getDetailView(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Moderator)
  @Post("/api")
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  
  async create(@Body() news: CreateNewsDto,  @UploadedFile() cover) : Promise<NewsEntity> {
    const fileExtension = cover.originalname.split('.').reverse()[0];
    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
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
    const createdNews = await this.newsService.create(news);
    return createdNews;
  } 

  @Post('/api/:id')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() news: EditNewsDto,
  ): Promise<NewsEntity> {
    const newsEditable = await this.newsService.edit(id, news);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return newsEditable;
  } 

  @Delete('/api/:id') //put
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const isRemoved = await this.newsService.remove(id);
    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'Новость удалена' : 'Передан неверный идентификатор',
      },
      HttpStatus.OK,
    );
  } 

  @Get('/api/data/:all') //back
  async getAll(): Promise<NewsEntity[]> {
    return this.newsService.findAll();
  }

  @Get('/all') //front
  @Render('news-list')
  async getAllView() {
    const news = await this.newsService.findAll();
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