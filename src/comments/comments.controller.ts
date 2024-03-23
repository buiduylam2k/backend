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
import { CommentDomainUtils } from './domain/utils';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './domain/comment';
import { QueryCommentDto } from './dto/query-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@SerializeOptions({
  groups: ['admin', 'me'],
})
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Blogs')
@Controller({
  path: 'blogs',
  version: '1',
})
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @NestPost()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() request,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, request.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryCommentDto,
  ): Promise<InfinityPaginationResultType<Comment>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > CommentDomainUtils.QUERY_LIMIT) {
      limit = CommentDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.commentsService.findManyWithPagination({
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
  findOne(@Param('id') id: Comment['id']): Promise<NullableType<Comment>> {
    return this.commentsService.findOne({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Comment['id'],
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Comment['id']): Promise<void> {
    return this.commentsService.softDelete(id);
  }
}
