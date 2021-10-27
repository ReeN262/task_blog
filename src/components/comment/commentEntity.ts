import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne, BaseEntity,
} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';

@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToOne(() => Post, (post) => post.comment, {onDelete: 'CASCADE'})
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.comment, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;
}
