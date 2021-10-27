import connectionDb from '../../db';
import {getManager} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';
import {createPost} from '@components/post/postService';
import {createNewUser} from '@components/user/userService';
import {
  createNewComment,
  deleteComment,
  findCommentByFilter,
  findCommentById,
  getAllPostComments, updateComment,
} from '@components/comment/commentService';
import {Comment} from '@components/comment/commentEntity';

describe('TEST post service', () => {
  let post: Post;
  let user: User;
  let comment: Comment;

  const testPostData = {
    title: 'testComment',
    description: 'tests',
  };
  const testUserData = {
    name: 'test',
    email: 'test@tests.com',
    password: 'test',
    phone: '123342345',
  };
  const testCommentDescription = 'test';

  const clearDatabase = async () => {
    await getManager().remove(user);
  };
  beforeAll(async () => {
    await connectionDb;
  });
  beforeEach( async () => {
    user = await createNewUser(testUserData);
    post = await createPost(testPostData, user);
    comment = await createNewComment(post, user, testCommentDescription);
  });

  afterEach(async () => {
    await clearDatabase();
  });
  describe('CreateNewComment Function', () => {
    test('return new comment', async () => {
      expect(await createNewComment(post, user, testCommentDescription)).toEqual(expect.objectContaining({
        description: testCommentDescription,
      }));
    });
  });

  describe('GetAllPostComments Function', () => {
    test('return all post comments', async () => {
      const data = {
        postId: post.id,
        skip: 0,
        offset: 30,
      };
      expect(await getAllPostComments(data)).toEqual(expect.arrayContaining([
        expect.objectContaining({
          description: testCommentDescription,
        }),
      ]));
    });
  });
  describe('FindCommentByFilter Function', () => {
    test('return post by filter', async () => {
      expect(await findCommentByFilter({description: testCommentDescription})).toEqual(expect.objectContaining({
        description: testCommentDescription,
      }));
    });
  });
  describe('FindCommentById Function', () => {
    test('return comment by id', async () => {
      expect(await findCommentById(comment.id)).toEqual(expect.objectContaining({
        description: testCommentDescription,
      }));
    });
  });
  describe('UpdatePost Function', () => {
    test('return updated post', async () => {
      const newDescription = 'hello';
      expect(await updateComment(comment.id, newDescription)).toEqual(expect.objectContaining({
        description: newDescription,
      }));
    });
  });
  describe('DeleteComment Function', () => {
    test('remove comment and show removed comment', async () => {
      expect(await deleteComment(comment)).toEqual(expect.objectContaining({
        description: testCommentDescription,
      }));
    });
  });
});


