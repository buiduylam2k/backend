import { Tag } from 'src/tags/domain/tag';
import { Comment } from './comment';
import { User } from 'src/users/domain/user';

export class Post {
  id: number | string;

  title: string;
  content: string;
  banner: string;
  views: number;
  slug: string;

  author: string;
  tag: string;
  comments: string[];

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class PostPopulate {
  id: number | string;

  title: string;
  content: string;
  banner: string;
  views: number;
  slug: string;

  author: User;
  tag: Tag;
  comments: Comment[];

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
