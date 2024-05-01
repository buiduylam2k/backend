import {
  Controller,
  Get,
  Post,
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
import { BlogsService } from './blogs.service';
import { Blog } from './domain/blog';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { BlogDomainUtils } from './domain/utils';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';

@ApiTags('Blogs')
@Controller({
  path: 'blogs',
  version: '1',
})
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBlogDto: CreateBlogDto,
    @Request() request,
  ): Promise<Blog> {
    return this.blogsService.create(createBlogDto, request.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryBlogDto,
  ): Promise<InfinityPaginationResultType<Blog>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > BlogDomainUtils.QUERY_LIMIT) {
      limit = BlogDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.blogsService.findManyWithPagination({
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
  findSlug(@Param('slug') slug: Blog['slug']): Promise<NullableType<Blog>> {
    return this.blogsService.findOne({ slug });
  }

  @Get(':slug/seo')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  getSeo(@Param('slug') slug: Blog['slug']): Promise<NullableType<Blog>> {
    return this.blogsService.findOne({ slug });
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  update(
    @Param('slug') slug: Blog['slug'],
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog | null> {
    return this.blogsService.update(slug, updateBlogDto);
  }

  @Patch(':slug/add-view')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  addView(@Param('slug') slug: Blog['slug']): Promise<void> {
    return this.blogsService.addView(slug);
  }

  @Delete(':slug')
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('slug') slug: Blog['slug']): Promise<void> {
    return this.blogsService.softDelete(slug);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAll(): Promise<void> {
    return this.blogsService.deleteAll();
  }
}
