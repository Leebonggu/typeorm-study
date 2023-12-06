import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Generated,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  /**
   * if
   *
   * PrimaryColumn() // If you want to generate the id yourself
   * 테이블 안에서 각 로우를 구분할 수 있는 칼럼
   * 무조건 유니크한 값으로 넣어줘야함.
   */
  id: string;

  @Column({
    /**
     * db에서 인지하는 칼럼타입.
     * 타입스크립트의 타입을 통해 유추됨
     */
    type: 'varchar',
    /**
     * 컬럼 이름
     * 프로퍼니 이름으로 자동 유추
     */
    name: 'email',
    /**
     * 실제 입력할 수 있는 값의 길이
     */
    length: 255,
    /**
     * nullalbe 허용 여부
     */
    nullable: true,
    /**
     * 처음 생성할때만 값 지정가능
     */
    update: false,
    /**
     * 기본이 true
     * find할때 가져옴
     */
    select: true,
    /**
     * 아무것도 입력하지 않았을 때 입력값
     */
    default: 'default title',
    /**
     * 칼럼에서 유일무이한 값이 되어야 하는지
     * primaryGeneratedColumn을 사용하면 자동으로 유니크 적용
     * ex) 회원가입 이메일 같은 경우
     */
    unique: false,
  })
  email: string;

  /**
   * enum 타입
   * 특정 타입으로 값을 지정할 때 사용
   */
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  /**
   * 데이터가 생성되는 일자가 자동으로 생섬
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 데이터가 업데이트 되는 일자가 자동으로 생성
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 데이터가 업데이트 될 때마다 버전이 올라감
   * 처음은 1
   * 세이브 함수가 몇 번 불렸는지.
   */
  @VersionColumn()
  version: number;

  @Column({
    default: 0,
  })
  count: number;

  @Column({
    update: false,
    select: false,
  })
  @Generated('increment')
  additionalId: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    // find할 때  profile도 같이 가져옴
    eager: false,
    // 저장할 때 raleted된 profile도 같이 저장
    cascade: true,
    // default true
    nullable: true,
    // 관계가 삭제 했을 떄 onDelete: '',
    // CASCADE 참조하는 테이블의 데이터도 같이 삭제
    // SET NULL 참조하는 테이블의 데이터를 null로 변경
    // RESTRICT 참조하는 테이블의 데이터가 있으면 삭제 불가
    // NO ACTION CASCADE와 같음
    // SET DEFAULT 참조하는 테이블의 데이터를 default 값으로 변경 (테이블에 설정된 기본설정값)
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
