export class Blog {
  id: number | string;
  banner: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  views: number;
  author: string;
  tag: string;
  slug: string;
}
