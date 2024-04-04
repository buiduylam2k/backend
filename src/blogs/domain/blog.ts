export class Blog {
  id: number | string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  views: number;
  author: string;
  tags: string[];
  slug: string;
}
