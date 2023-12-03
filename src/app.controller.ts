import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entity/profile.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  @Get('users')
  users() {
    return this.userRepository.find({
      relations: {
        profile: true,
      },
    });
  }

  @Post('users')
  create() {
    return this.userRepository.save({
      role: Role.ADMIN,
    });
  }

  @Patch('users/:id')
  async update(@Param('id') id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    const updated = await this.userRepository.save({
      ...user,
    });

    return updated;
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'lee@bong.gu',
      role: Role.ADMIN,
    });

    const profile = await this.profileRepository.save({
      profileImg: 'https://avatars.githubusercontent.com/u/26598542?v=4',
      user,
    });

    return {
      user,
      profile,
    };
  }
}
