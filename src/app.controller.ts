import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entitiy';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('users')
  users() {
    return this.userRepository.find();
  }

  @Post('users')
  create() {
    return this.userRepository.save({
      title: 'test title',
      role: Role.ADMIN,
    });
  }

  @Patch('users/:id')
  async update(@Param('id') id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    const updated = await this.userRepository.save({
      ...user,
      title: 'updated title',
    });

    return updated;
  }
}
