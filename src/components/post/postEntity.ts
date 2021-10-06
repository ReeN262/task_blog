import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Comment} from '@components/comment/commentEntity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
  })
  title: string;

  @Column({
    length: 2000,
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

  @ManyToOne((type) => User, (user) => user.post)
  @JoinColumn()
  user: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  @JoinColumn()
  comment: Comment[];
}
