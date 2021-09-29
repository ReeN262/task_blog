import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import {User} from "../user/userEntity";
import {Like} from "../like/likeEntity";
import {Comment} from "../comment/commentEntity";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200
    })
    title: String;

    @Column({
        length: 2000
    })
    description: String;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => User, user => user.post)
    @JoinColumn()
    user: User;

    @OneToMany(type => Like, like => like.post)
    @JoinColumn()
    like: Like[];

    @OneToMany(type => Comment, comment => comment.post)
    @JoinColumn()
    comment: Comment[];

}