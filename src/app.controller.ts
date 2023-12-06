import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entity';
import { ILike, In, LessThan, Repository } from 'typeorm';
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
      /**
       * 어떤 프로퍼티를 가져올지
       * 기본은 다 가져옴
       * select를 정의하면 선택된 프로퍼티만 가져옴
       * */
      select: {},
      /**
       * 필터링할 조건을 입력하게 된다.
       * 전부 and 조건으로 처리된다.
       * or는 [{}, {}] 형식으로 주면된다.
       */
      where: {
        // id: Not('e369649f-21fa-46b3-9789-94691fdfa6ef'), // 아닌경우
        // id: LessThan() 작은 경우
        // id: MoreThan() 큰 경우
        // email: Like('%@google.com'), // 유사한 경우
        // email: ILike('%@google.com'), // 유사한 경우 + 대소문자 구분없음
      },
      /**
       * relation을 가져올 수 있다.
       * relation을 추가하면 select, where에서도 사용가능하다.
       */
      relations: {},
      /**
       * ASC 오름차, DESC 내림차
       */
      order: {},
      /**
       * 처음 몇 개를 제외할 떄
       */
      skip: 0,
      /**
       * 몇개를 가져올지
       */
      take: 0,
    });
  }

  @Post('users')
  async create() {
    for (let i = 0; i < 10; i++) {
      await this.userRepository.save({
        email: 'user' + i + '@google.com',
      });
    }
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
    return this.postRepository.find();
  }

  @Get('tags')
  async getTags() {
    return this.tagRepository.find();
  }

  @Delete('user/profile')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete({ id: +id });
  }

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체생성 -> 저장은 안함
    const user1 = this.userRepository.create({
      email: 'hello@naver.com',
    });

    // 생성 + 저장
    const user2 = this.userRepository.save({
      email: 'hello@naver.com',
    });

    // prepare를 사용하면 저장은 안하고 객체만 생성
    // 렵된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고, 추가 입력된 값으로 데이터베이스에서 가져온 값을들 대체
    // 저장은 안함
    const user3 = this.userRepository.preload({
      id: 'uuid',
      email: 'hello@naver.com',
    });

    // 삭제
    this.userRepository.delete({ id: 'uuid' });

    // 증가
    await this.userRepository.increment({ id: 'uuid' }, 'count', 1);

    // 감소
    await this.userRepository.decrement({ id: 'uuid' }, 'count', 1);

    //개수
    const count = await this.userRepository.count({
      where: {
        email: ILike('%@naver.com'),
      },
    });

    // 합계
    const sum = await this.userRepository.sum('count', {
      email: ILike('%@naver.com'),
    });

    // 평균
    const avg = await this.userRepository.average('count', {
      email: In(['']),
    });

    // 최소
    const min = await this.userRepository.minimum('count', {
      email: In(['']),
    });

    // 최대
    const max = await this.userRepository.maximum('count', {
      email: In(['']),
    });

    // 찾고 + 개수
    const usersAndCound = await this.userRepository.findAndCount({ take: 3 });
  }
}
