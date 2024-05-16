import {
  Controller,
  Get,
  Post as NestPost,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './domain/post';
import { PostDomainUtils } from './domain/utils';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @NestPost()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() request,
  ): Promise<Post> {
    return this.postsService.create(createPostDto, request.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @NestPost(':id/add-comment')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() request,
  ): Promise<void> {
    return this.postsService.addComment(id, request.user.id, createCommentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/delete-comment/:cmtId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'cmtId',
    type: String,
    required: true,
  })
  deleteComment(
    @Param('id') id: string,
    @Param('cmtId') cmtId: string,
  ): Promise<void> {
    return this.postsService.removeComment(id, cmtId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryPostDto,
  ): Promise<InfinityPaginationResultType<Post>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > PostDomainUtils.QUERY_LIMIT) {
      limit = PostDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.postsService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  findOne(@Param('slug') slug: string): Promise<NullableType<Post>> {
    return this.postsService.findOnePopulate({ slug });
  }

  @Get(':slug/seo')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  getSlug(@Param('slug') slug: string): Promise<string> {
    return this.postsService.getPostSlug(slug);
  }

  @Patch(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  update(
    @Param('slug') slug: Post['slug'],
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<Post | null> {
    return this.postsService.update(slug, updatePostDto);
  }

  @Patch(':slug/add-view')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  addView(@Param('slug') slug: Post['slug']): Promise<Post | null> {
    return this.postsService.addView(slug);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Post['id']): Promise<void> {
    return this.postsService.softDelete(id);
  }

  @Delete('/delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAll(): Promise<void> {
    return this.postsService.deleteAll();
  }

  @Delete('/delete-comment')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAllCmt(): Promise<void> {
    return this.postsService.deleteAllCmt();
  }
}
