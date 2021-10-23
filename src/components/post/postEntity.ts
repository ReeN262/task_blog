import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany, BaseEntity,
} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Comment} from '@components/comment/commentEntity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({name: 'userid'})
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinColumn()
  comment: Comment[];
}
