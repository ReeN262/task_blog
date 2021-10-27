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

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => Post, (post) => post.user, {cascade: true})
  @JoinColumn()
  post: Post[];

  @OneToMany(() => Like, (likes) => likes.user, {cascade: true})
  @JoinColumn()
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user, {cascade: true})
  @JoinColumn()
  comment: Comment[];
}
