import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';
import {Comment} from '@components/comment/commentEntity';
import {PolymorphicParent} from 'typeorm-polymorphic';
import {PolymorphicChildInterface} from 'typeorm-polymorphic/dist/polymorphic.interface';

@Entity('like')
export class Like implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @PolymorphicParent(() => [Comment, Post])
  owner: Comment | Post

  @Column()
  entityId: number;

  @Column()
  entityType: string;

  @CreateDateColumn({
    name: 'create_at',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({
    name: 'userId',
  })
  user: User;
}
