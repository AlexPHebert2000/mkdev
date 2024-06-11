import React, { useState, ReactElement, useEffect } from 'react';
import axios from 'axios';
import UsersPost from './UsersPost';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  linkedIn: string;
  github: string;
  sub: string;
  username: string;
  picture: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface ProfileProps {
  posts: Post[];
}

const UserPosts = ({ posts }: ProfileProps): ReactElement => {
  return (
    <>
      {posts.map((post: any) => (
        <UsersPost key={post.id} post={post} />
      ))}
    </>
  );
};

export default UserPosts;
