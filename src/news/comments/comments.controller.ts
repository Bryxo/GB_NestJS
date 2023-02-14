import { Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { CommentsService, Comment, CommentEdit } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor (private readonly commentsService: CommentsService) {}
  
  @Post('/api/:idNews')
    create(@Param('idNews') idNews: string, @Body() comment: Comment) {
      const idNewsInt = parseInt(idNews);
      return this.commentsService.create(idNewsInt, comment)
    }

    //--------------------------------------------------
    // @Put('/api/:idNews/:idComment')
    // edit(
    //   @Param('idNews') idNews: string,
    //   @Param('idComment') idComment: string,
    //   @Body() comment: CommentEdit,
    // ) {
    //   const idNewsInt = parseInt(idNews);
    //   const idCommentInt = parseInt(idComment);
    //   return this.commentsService.edit(idNewsInt, idCommentInt, comment);
    // }

  @Post('/api/:idNews/:idComment')
    editComments(@Param('idNews') idNews: string, @Param('idComment') idComment: string, @Body() comment: CommentEdit) 
    {
      const idNewsInt = parseInt(idNews);
      const idIntComment = parseInt(idComment);
      const isEdited = this.commentsService.edit(idNewsInt, idIntComment, comment); 
      return isEdited ? 'Комментарий отредактирован' : 'Комментарий не отредактирован - передан неверный id';
  } 
//--------------------------------------------------

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

