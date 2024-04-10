export class Post {
  id: number | string;

  title: string;
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
