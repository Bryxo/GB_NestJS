import { Injectable } from '@nestjs/common';
//import { News } from '../news.interface';

export type Comment = {
  id?: number;
  message: string;
  author: string;
  createdAt?: Date;
  idNews: number;
};

export type CommentEdit = {
  id?: number;
  message?: string;
  author?: string;
  createdAt?: Date;
}

@Injectable()
export class CommentsService {
  private readonly comments = [];

  create(idNews: number, comment: Comment) {
    if (!this.comments[idNews]) {
      this.comments[idNews] = []
    }
    this.comments[idNews].push({
      ...comment, 
      id: Date.now()
    })
    return "Комментарий добавлен";
  }

//--------------------------------------------------
edit(idNews: number, idComment: number, comment: CommentEdit) {
  const indexComment =
    this.comments[idNews]?.findIndex((c) => c.id === idComment);
  
    if (!this.comments[idNews] || indexComment) {
    return false;
  }

  this.comments[idNews][indexComment] = {
    ...this.comments[idNews][indexComment],
    comment,
  };
  return 'Комментарий был создан';
}


//------------------------------------------------------

  find(idNews: number): Comment[] | null {
      return this.comments[idNews] || null;
    }

  remove(idNews: number, idComment: number): Comment [] | null {
    if (!this.comments[idNews]) {
      return null
    }

    const indexComment = this.comments[idNews].findIndex((c) => c.id === idComment);
    
    if (indexComment === -1) {
      return null
    }
    return this.comments[idNews].splice(indexComment,1);
  }  

}
