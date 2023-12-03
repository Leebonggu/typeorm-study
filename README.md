# TypeORM

## Relation

### one to one

- User -> Profile
- 한 테이블은 다른 테이블의 '어떤 키값'을 참조

### one to many

- User
  - Post1
  - Post2
  - Post3
- 한 테이블은 다른 테이블의 '어떤 키값'을 여러개 참조

### many to one

- Post1 -> User1
- Post2 -> User1
- Post3 -> User1
- 굳이 맵핑시킬 아이디를 만들 필요는 없네?
  - ManyToOne하는 쪽에서 Id를 가지고있음
    - 반대로는 가져올 수 없음

```ts
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  author: User;

...

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
```

### Many to Many

- Post1 > Tag1
- Post2 > Tag1, Tag2
- Post3 > Tag2, Tag3

- Many to Many는 중간에 맵핑 테이블이 생김.
