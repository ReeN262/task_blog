import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 300,
  })
  description: string;

  @CreateDateColumn({
    name: 'create_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
  })
  updatedAt: Date;

  @ManyToOne((type) => Post, (post) => post.comment)
  @JoinColumn()
  post: Post;

  @ManyToOne((type) => User, (user) => user.comment)
  @JoinColumn()
  user: User;
}
