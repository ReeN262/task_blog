import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn, BaseEntity,
} from 'typeorm';

import {Post} from '@components/post/postEntity';
import {Comment} from '@components/comment/commentEntity';
import {Like} from '@components/like/likeEntity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 50,
  })
  email: string;

  @Column({
    length: 20,
  })
  phone: string;

  @Column({
    length: 100,
  })
  password: string;

  @OneToMany((type) => Post, (post) => post.user)
  @JoinColumn()
  post: Post[];

  @OneToMany((type) => Like, (like) => like.user)
  @JoinColumn()
  like: Like[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  @JoinColumn()
  comment: Comment[];
}
