import { Expose } from 'class-transformer';

export class Blog {
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  views: number;
  author: string;
  tags: string[];
}
