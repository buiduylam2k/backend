import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugGeneratorService {
  constructor() {}

  generateUniqueSlug(title: string): string {
    const baseSlug = slugify(title.toLowerCase(), {
      replacement: '-',
      remove: undefined,
      lower: true,
    });

    return `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  }
}
