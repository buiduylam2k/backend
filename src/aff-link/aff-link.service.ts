import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { AffLinkRepository } from './infrastructure/persistence/aff-link.repository';
import { AffLink } from './domain/aff-link';
import { CreateAffLinkDto } from './dto/create-aff-link.dto';
import { FilterAffLinkDto, SortAffLinkDto } from './dto/query-aff-link.dto';

@Injectable()
export class AffLinkService {
  constructor(private readonly affLinkRepository: AffLinkRepository) {}

  async create(createAffLinkDto: CreateAffLinkDto): Promise<AffLink> {
    const clonedPayload = {
      ...createAffLinkDto,
      isActive: false,
    };

    return this.affLinkRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterAffLinkDto | null;
    sortOptions?: SortAffLinkDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<AffLink[]> {
    return this.affLinkRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<AffLink>): Promise<NullableType<AffLink>> {
    return this.affLinkRepository.findOne(fields);
  }

  async update(
    id: AffLink['id'],
    payload: DeepPartial<AffLink>,
  ): Promise<AffLink | null> {
    return this.affLinkRepository.update(id, payload);
  }

  async softDelete(id: AffLink['id']): Promise<void> {
    await this.affLinkRepository.softDelete(id);
  }

  async getActive(): Promise<AffLink | null> {
    return this.affLinkRepository.getActive();
  }
}
