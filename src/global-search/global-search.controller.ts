import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { CreateGlobalSearchDto } from './dto/create-global-search.dto';
import { UpdateGlobalSearchDto } from './dto/update-global-search.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { QueryGlobalSearchDto } from './dto/query-global-search.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { GlobalSearch } from './domain/global-search';
import { GlobalSearchDomainUtils } from './domain/utils';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiTags('Global Search')
@Controller({
  path: 'global-search',
  version: '1',
})
export class GlobalSearchController {
  constructor(private readonly globalSearchService: GlobalSearchService) {}

  // @ApiBearerAuth()
  // @Roles(RoleEnum.admin)
  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Post()
  // create(@Body() createGlobalSearchDto: CreateGlobalSearchDto) {
  //   return this.globalSearchService.create(createGlobalSearchDto);
  // }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryGlobalSearchDto,
  ): Promise<InfinityPaginationResultType<GlobalSearch>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > GlobalSearchDomainUtils.QUERY_LIMIT) {
      limit = GlobalSearchDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.globalSearchService.findManyWithPagination({
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

  // @ApiBearerAuth()
  // @Roles(RoleEnum.admin)
  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // update(
  //   @Param('id') id: GlobalSearch['id'],
  //   @Body() updateGlobalSearchDto: UpdateGlobalSearchDto,
  // ): Promise<GlobalSearch | null> {
  //   return this.globalSearchService.update(id, updateGlobalSearchDto);
  // }

  // @ApiBearerAuth()
  // @Roles(RoleEnum.admin)
  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Delete(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id') id: GlobalSearch['id']): Promise<void> {
  //   return this.globalSearchService.delete(id);
  // }
}
