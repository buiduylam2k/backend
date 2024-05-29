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
import { TagDomainUtils } from './domain/utils';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './domain/tag';
import { QueryTagDto } from './dto/query-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('Tags')
@Controller({
  path: 'tags',
  version: '1',
})
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTagDto: CreateTagDto, @Request() request): Promise<Tag> {
    return this.tagsService.create(createTagDto, request.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryTagDto,
  ): Promise<InfinityPaginationResultType<Tag>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > TagDomainUtils.QUERY_LIMIT) {
      limit = TagDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.tagsService.findManyWithPagination({
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

  @Get('group')
  @HttpCode(HttpStatus.OK)
  groupTags() {
    return this.tagsService.groupsTag();
  }

  @Get('group/:type')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'type',
    type: String,
    required: true,
  })
  findTagsByType(@Param('type') type: Tag['type']) {
    return this.tagsService.findTagFilterByType(type);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Tag['id']): Promise<NullableType<Tag>> {
    return this.tagsService.findOne({ id });
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Tag['id'],
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag | null> {
    return this.tagsService.update(id, updateTagDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @SerializeOptions({
    groups: ['admin', 'me'],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Tag['id']): Promise<void> {
    return this.tagsService.softDelete(id);
  }
}
