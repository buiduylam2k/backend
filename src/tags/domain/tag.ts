import { TagEnum } from './enum';

export class Tag {
  id: number | string;
  name: string;
  type: TagEnum;
  createdAt: Date;
  updatedAt: Date;
  isActiveNav: boolean;
  isDeleted: boolean;
  author: string;
}
