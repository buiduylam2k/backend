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
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { AffLinkDomainUtils } from './domain/utils';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { CreateAffLinkDto } from './dto/create-aff-link.dto';
import { AffLink } from './domain/aff-link';
import { AffLinkService } from './aff-link.service';
import { QueryAffLinkDto } from './dto/query-aff-link.dto';
import { UpdateAffLinkDto } from './dto/update-aff-link.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@SerializeOptions({
  groups: ['admin', 'me'],
})
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('AffLink')
@Controller({
  path: 'aff-link',
  version: '1',
})
export class AffLinkController {
  constructor(private readonly affLinkService: AffLinkService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAffLinkDto: CreateAffLinkDto): Promise<AffLink> {
    return this.affLinkService.create(createAffLinkDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryAffLinkDto,
  ): Promise<InfinityPaginationResultType<AffLink>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > AffLinkDomainUtils.QUERY_LIMIT) {
      limit = AffLinkDomainUtils.QUERY_LIMIT;
    }

    return infinityPagination(
      await this.affLinkService.findManyWithPagination({
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

  @Get('active')
  @HttpCode(HttpStatus.OK)
  getActive(): Promise<AffLink | null> {
    return this.affLinkService.getActive();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: AffLink['id'],
    @Body() updateAffLinkDto: UpdateAffLinkDto,
  ): Promise<AffLink | null> {
    return this.affLinkService.update(id, updateAffLinkDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: AffLink['id']): Promise<void> {
    return this.affLinkService.softDelete(id);
  }
}
