import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/infrastructure/persistence/document/entities/user.schema';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserSchemaClass',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
