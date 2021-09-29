import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import {Post} from "../post/postEntity";
import {Like} from "../like/likeEntity";
import {Comment} from "../comment/commentEntity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: String;

    @Column({
        length: 50
    })
    email: String;

    @Column({
        length: 20
    })
    phone: String;

    @Column({
        length: 100
    })
    password: String;

    @OneToMany(type => Post, post => post.user)
    @JoinColumn()
    post: Post[];

    @OneToMany(type => Like, like => like.user)
    @JoinColumn()
    like: Like[];

    @OneToMany(type => Comment, comment => comment.user)
    @JoinColumn()
    comment: Comment[];


}