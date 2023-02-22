import { Controller, Param, Body, Get, Post, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { EditCommentDto } from './dtos/edit-comment-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HelperFileLoader } from '../../utils/HelperFileLoader';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor (private readonly commentsService: CommentsService) {}
  
  @Post('/api/:idNews')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  create(
    @Param('idNews') idNews: string,
    @Body() comment: CreateCommentDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (avatar?.filename) {
      comment.avatar = PATH_NEWS + avatar.filename;
    } 
      
      
      const idNewsInt = parseInt(idNews);
      return this.commentsService.create(idNewsInt, comment)
    }

    @Put('/api/:idNews/:idComment')
    edit(
      @Param('idNews') idNews: string,
      @Param('idComment') idComment: string,
      @Body() comment: EditCommentDto,
    ) {
      const idNewsInt = parseInt(idNews);
      const idCommentInt = parseInt(idComment);
      return this.commentsService.edit(idNewsInt, idCommentInt, comment);
    }

  @Get('/api/:idNews')
    get(@Param('idNews') idNews: string) {
      const idNewsInt = parseInt(idNews);
        if (!this.commentsService.find(idNewsInt)) {
          return `Комментариев к новости с id:${idNewsInt} нет`
        };
      return this.commentsService.find(idNewsInt)
    }

  @Delete('/api/:idNews/:idComments')
    removeComments(
      @Param('idNews') idNews: string, 
      @Param('idComments') idComment: string
      ) {
        const idNewsInt = parseInt(idNews);
        const idCommentInt = parseInt(idComment);
        const isRemoved = this.commentsService.remove(idNewsInt, idCommentInt);
        return isRemoved ? 'Комментарий удалён' : 'Комментарий не удалён - передан неверный id' 
      }
}

