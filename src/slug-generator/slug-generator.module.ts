import { Module } from '@nestjs/common';
import { SlugGeneratorService } from './slug-generator.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SlugGeneratorService],
  exports: [SlugGeneratorService],
})
export class SlugGeneratorModule {}
