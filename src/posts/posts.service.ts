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
import { GlobalSearchService } from 'src/global-search/global-search.service';
import { InsertPostCsvDto } from './dto/insert-csv-post.dto';
import * as fs from 'fs';
import path from 'path';
import csv from 'csvtojson';
import bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostRepository,
    private readonly commentsRepository: CommentRepository,
    private readonly slugGenerator: SlugGeneratorService,
    private readonly globalSearchService: GlobalSearchService,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const { content, banner, title, answer } = createPostDto;
    const slug = this.slugGenerator.generateUniqueSlug(title);

    const clonedPayload = {
      banner,
      content,
      views: 0,
      isDeleted: false,
      author: authorId,
      comments: [],
      title,
      slug,
      answer
    };
    const posted = await this.postsRepository.create(clonedPayload);
    await this.globalSearchService.create({
      name: posted.title,
      originId: posted.id.toString(),
      type: 'post',
      slug: posted.slug,
    });
    return posted;
  }

  async insertCsv(insertPostCsv: InsertPostCsvDto, file: Express.Multer.File) {
    const user = await this.usersService.findOne({
      email: 'admin@example.com',
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      insertPostCsv.pwd,
      user.password!,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const postPath = `${path.join(__dirname, '../..', 'assets')}/posts.csv`;
    fs.writeFileSync(postPath, file.buffer);
    const output = (await csv().fromFile(postPath)) as Array<Post>;
    for await (const post of output) {
      await this.create(
        {
          title: post.title,
          banner: post.banner,
          content: post.content,
          answer: post.answer,
        },
        user.id.toString(),
      );
    }
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

    let updateSlug = post.slug;

    if (payload.title) {
      updateSlug = this.slugGenerator.generateUniqueSlug(payload.title);
      await this.globalSearchService.updateByOriginId(post.id.toString(), {
        name: payload.title,
        slug: updateSlug,
      });
    }

    const clonedPayload = { ...payload, slug: updateSlug } as Post;

    return this.postsRepository.update(post.id, clonedPayload);
  }

  async softDelete(id: Post['id']): Promise<void> {
    await this.postsRepository.softDelete(id);
    await this.globalSearchService.deleteByOriginId(id.toString());
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
