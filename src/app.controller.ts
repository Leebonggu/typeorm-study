import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entity/profile.entity';
import { Post as PostEntity } from './entity/post.entity';
import { Tag } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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

  @Post('posts/tags')
  async createPostAndTags() {
    const tag1 = await this.tagRepository.save({
      name: 'tag1',
    });
    const tag2 = await this.tagRepository.save({
      name: 'tag2',
    });
    await this.postRepository.save({
      title: 'post1',
      tags: [tag1, tag2],
    });
    await this.postRepository.save({
      title: 'post2',
      tags: [tag1],
    });

    return true;
  }

  @Get('posts')
  async getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  async getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
