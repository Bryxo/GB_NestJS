import { News } from "src/news/news.service";

export function renderNewsAll (news: News[]): string {
      let newListHtml = '';
  for (const newsItem of news) {
    newListHtml += renderNewsBlock(newsItem);
  }
  return `
    <h1> Список новостей </h1>
    <div class="row">
      ${newListHtml}
    </div>
  `
}

function renderNewsBlock (news: News): string {
return `
  <div class="col-lg-4 mb-2"> 
    <div class="card" style="width: 100%;">
      ${
        news.cover  //если существует, то...
          ? `<img src="${news.cover}" class="card-img-top" alt="..." style="object-fit: cover; height: 200px" >` 
          : ''
      }
      <div class="card-body">
        <h3 class="card-title">${news.title}</h3>
        <h4 class="card-subtitle mb-2 text-muted">${news.author}</h4>
        <h5 class="card-text">${news.description}</h5>
      </div>
    </div>
  </div>
`
}

