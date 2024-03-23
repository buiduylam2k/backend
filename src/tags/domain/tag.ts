import { Expose } from 'class-transformer';

export class Tag {
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  author: string;
}
