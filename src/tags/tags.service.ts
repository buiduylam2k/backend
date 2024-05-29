import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { TagRepository } from './infrastructure/persistence/tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './domain/tag';
import { FilterTagDto, SortTagDto } from './dto/query-tag.dto';
import { groupBy } from 'lodash';
import { TagEnum } from './domain/enum';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagRepository) {}

  async create(createtagDto: CreateTagDto, authorId: string): Promise<Tag> {
    const clonedPayload = {
      ...createtagDto,
      author: authorId,
    };

    const tagObject = await this.tagsRepository.findOne({
      name: clonedPayload.name,
      type: clonedPayload.type,
      isDeleted: false,
    });

    if (tagObject) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            name: 'tagAlreadyExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.tagsRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTagDto | null;
    sortOptions?: SortTagDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Tag[]> {
    return this.tagsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Tag>): Promise<NullableType<Tag>> {
    return this.tagsRepository.findOne(fields);
  }

  async update(id: Tag['id'], payload: DeepPartial<Tag>): Promise<Tag | null> {
    return this.tagsRepository.update(id, payload);
  }

  async softDelete(id: Tag['id']): Promise<void> {
    await this.tagsRepository.softDelete(id);
  }

  async groupsTag() {
    const query = {
      isActiveNav: true,
    } as Tag;

    const tags = await this.tagsRepository.find(query);

    const groups = groupBy(tags, 'type');

    return groups;
  }

  async findTagFilterByType(type?: TagEnum) {
    const query = {
      isActiveNav: true,
      type,
    } as Tag;

    return this.tagsRepository.find(query);
  }
}
