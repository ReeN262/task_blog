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
import {Comment} from '@components/comment/commentEntity';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column('boolean')
  isLike: boolean;

  @Column()
  entityType: string;

  @CreateDateColumn({
    name: 'create_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
  })
  updatedAt: Date;

  @ManyToOne((type) => Post, (post) => post.like)
  @JoinColumn({
    name: 'postID',
  })
  post: Post;

  @ManyToOne((type) => User, (user) => user.like)
  @JoinColumn({
    name: 'commentID',
  })
  comment: Comment;

  @ManyToOne((type) => User, (user) => user.like)
  @JoinColumn({
    name: 'userID',
  })
  user: User;
}
