import { Injectable } from '@nestjs/common';
import { CreateGlobalSearchDto } from './dto/create-global-search.dto';
import { GlobalSearchRepository } from './infrastructure/persistence/global-search.repository';
import {
  FilterGlobalSearchDto,
  SortGlobalSearchDto,
} from './dto/query-global-search.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { GlobalSearch } from './domain/global-search';
import { UpdateGlobalSearchDto } from './dto/update-global-search.dto';

@Injectable()
export class GlobalSearchService {
  constructor(
    private readonly globalSearchRepository: GlobalSearchRepository,
  ) {}

  async create(createGlobalSearchDto: CreateGlobalSearchDto) {
    return await this.globalSearchRepository.create(createGlobalSearchDto);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterGlobalSearchDto | null;
    sortOptions?: SortGlobalSearchDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<GlobalSearch[]> {
    return this.globalSearchRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async update(
    id: GlobalSearch['id'],
    pdateGlobalSearchDto: UpdateGlobalSearchDto,
  ) {
    return this.globalSearchRepository.update(id, pdateGlobalSearchDto);
  }

  async updateByOriginId(
    originId: GlobalSearch['originId'],
    updateGlobalSearchDto: UpdateGlobalSearchDto,
  ): Promise<void> {
    await this.globalSearchRepository.updateByOriginId(
      originId,
      updateGlobalSearchDto,
    );
  }

  async delete(id: GlobalSearch['id']): Promise<void> {
    await this.globalSearchRepository.softDelete(id);
  }

  async deleteByOriginId(originId: GlobalSearch['originId']): Promise<void> {
    await this.globalSearchRepository.deleteByOriginId(originId);
  }

  async findOne(id: GlobalSearch['id']) {
    return this.findOne(id);
  }
}
