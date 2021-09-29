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
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 300
    })
    text: String;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => Post, post => post.comment)
    @JoinColumn()
    post: Post;

    @ManyToOne(type => User, user => user.comment)
    @JoinColumn()
    user: User;
}