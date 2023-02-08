export interface News{
  id?: number;
  title: string;
  description: string;
  author: string;
  createdAt?: Date;
}

export interface NewsEdit {
  title?: string;
  description?: string;
  author?: string;
  countView?: number;
  createdAt?: Date;
}