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
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @NestPost(':id/add-comment')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  addComment(
    @Param('id') id: Post['id'],
    @Body() createCommentDto: CreateCommentDto,
    @Request() request,
  ): Promise<Post['id']> {
    return this.postsService.addComment(id, request.user.id, createCommentDto);
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Post['id']): Promise<NullableType<Post>> {
    return this.postsService.findOne({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Post['id'],
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<Post | null> {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch(':id/add-view')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  addView(@Param('id') id: Post['id']): Promise<Post | null> {
    return this.postsService.addView(id);
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
}
