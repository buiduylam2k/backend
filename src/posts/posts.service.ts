import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './domain/post';
import { FilterPostDto, SortPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentRepository } from './infrastructure/persistence/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostRepository,
    private readonly commentsRepository: CommentRepository,
    private readonly slugGenerator: SlugGeneratorService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const { content, tag, banner, title } = createPostDto;
    const slug = this.slugGenerator.generateUniqueSlug(title);

    const clonedPayload = {
      banner,
      content,
      tag,
      views: 0,
      isDeleted: false,
      author: authorId,
      comments: [],
      title,
      slug,
    };

    return this.postsRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPostDto | null;
    sortOptions?: SortPostDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Post[]> {
    return this.postsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Post>): Promise<NullableType<Post>> {
    return this.postsRepository.findOne(fields);
  }

  findOnePopulate(fields: EntityCondition<Post>): Promise<NullableType<Post>> {
    return this.postsRepository.findOnePopulate(fields);
  }

  async addView(slug: Post['slug']): Promise<Post | null> {
    const post = await this.postsRepository.findOne({ slug });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            slug: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const payload = {
      views: post.views + 1,
    };

    return this.postsRepository.update(post.id, payload);
  }

  async update(
    slug: Post['slug'],
    payload: UpdatePostDto,
  ): Promise<Post | null> {
    const post = await this.postsRepository.findOne({ slug });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            slug: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let updateSlug;

    if (payload.title) {
      updateSlug = this.slugGenerator.generateUniqueSlug(payload.title);
    }

    const clonedPayload = { ...payload, slug: updateSlug } as Post;

    return this.postsRepository.update(post.id, clonedPayload);
  }

  async softDelete(id: Post['id']): Promise<void> {
    await this.postsRepository.softDelete(id);
  }

  async addComment(
    slug: string,
    author: string,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    const post = await this.findOne({ slug });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            slug: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { content } = createCommentDto;

    const newComment = await this.commentsRepository.create({
      content,
      author,
      post: post.id.toString(),
    });

    await this.update(post.slug, {
      comments: [...post.comments, newComment.id.toString()],
    });
  }

  async removeComment(id: string, cmtId: string): Promise<void> {
    const post = await this.findOne({ id });

    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            id: 'postNotFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.commentsRepository.softDelete(cmtId);

    await this.update(post.slug, {
      comments: post.comments.filter((comment) => comment !== cmtId),
    });
  }

  async getPostSlug(slug: string): Promise<string> {
    return await this.postsRepository.getSlug(slug);
  }

  async deleteAll() {
    return this.postsRepository.deleteAll();
  }

  async deleteAllCmt() {
    return this.commentsRepository.deleteAll();
  }
}
