import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Profile } from './entity/profile.entity';
import { Post } from './entity/post.entity';
import { Tag } from './entity/tag.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'do-typeorm',
      entities: [User, Profile, Post, Tag],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Profile, Post, Tag]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
