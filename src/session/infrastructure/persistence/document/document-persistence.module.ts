import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './entities/session.schema';
import { SessionRepository } from '../session.repository';
import { SessionDocumentRepository } from './repositories/session.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SessionSchemaClass', schema: SessionSchema },
    ]),
  ],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionDocumentRepository,
    },
  ],
  exports: [SessionRepository],
})
export class DocumentSessionPersistenceModule {}
