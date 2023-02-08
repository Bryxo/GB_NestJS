import { Injectable } from '@nestjs/common';
import { News, NewsEdit } from './news.interface';

@Injectable()
export class NewsService {
  private readonly news: News[]=[
    {
      id: 25,
      title: "news blyat title'",
      description: "news_desc",
      author: 'petrov',
    }
  ];

  create(news: News): News {
    const id = Date.now();
    console.log(id)
    const finalNews = 
      {...news,
      id: id,
      };
    this.news.push(finalNews)
    return finalNews;
  }

  edit(id: number, news: NewsEdit): News | undefined {
    const editNews = this.news.findIndex((news : News) => news.id === id);
    if (editNews !== -1) {
        this.news[editNews] = {
          ...this.news[editNews],
          ...news,
        };
        return this.news[editNews];
      };
    return undefined;
  }

  remove(id: News['id']) : boolean {
    const indexRemoveNews = this.news.findIndex((news : News) => news.id === id);
      if (indexRemoveNews !== -1) {
        this.news.splice(indexRemoveNews,1);
      return true
      }
    return false
  }  
  
  findById(id: News['id']): News|null {
    return this.news.find((news:News) => news.id===id)
  }

  findAll(): News[] {
    return this.news;
  }
}
