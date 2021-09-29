import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import {User} from "../user/userEntity";
import {Post} from "../post/postEntity";

@Entity()
export class Like {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    like: Boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => Post, post => post.like)
    @JoinColumn()
    post: Post;

    @ManyToOne(type => User, user => user.like)
    @JoinColumn()
    user: User;
}