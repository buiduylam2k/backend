import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { UserRepository } from '../user.repository';
import { UsersDocumentRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserSchemaClass', schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersDocumentRepository,
    },
  ],
  exports: [UserRepository],
})
export class DocumentUserPersistenceModule {}
