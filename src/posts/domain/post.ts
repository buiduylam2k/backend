import { Expose } from 'class-transformer';

export class Post {
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  content: string;
  banner: string;

  views: number;

  author: string;
  tags: string[];
  comments: string[];

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
