import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Profile } from './entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'do-typeorm',
      entities: [User, Profile],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
