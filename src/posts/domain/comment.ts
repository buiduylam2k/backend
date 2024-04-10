export class Comment {
  id: number | string;

  content: string;

  author: string;
  post: string;

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
