import { Expose } from 'class-transformer';

export class Comment {
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  content: string;

  author: string;
  post: string;

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
