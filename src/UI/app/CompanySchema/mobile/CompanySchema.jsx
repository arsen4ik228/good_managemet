import React, { useState, useEffect } from "react";
import classes from "./CompanySchema.module.css";
import Header from "@Custom/CustomHeader/Header";
import BlockSchema from "./blockSchema/BlockSchema";
import { usePostsHook } from "@hooks/usePostsHook";
import _ from "lodash";

const buildTree = (posts) => {
  const postMap = {};
  const roots = [];

  // Создаем карту постов
  posts.forEach((post) => {
    post.children = [];
    postMap[post.id] = post;
  });

  // Строим дерево
  posts.forEach((post) => {
    if (post.parentId === null) {
      roots.push(post);
    } else {
      if (postMap[post.parentId]) {
        postMap[post.parentId].children.push(post);
      }
    }
  });

  return roots;
};

const PostTree = ({ posts }) => {
  const tree = buildTree(posts);

  return (
    <div className={classes.wrapper}>
      {tree.map((post) => (
        <BlockSchema key={post.id} post={post} />
      ))}
    </div>
  );
};

export default function CompanySchema() {
  const {
    allPosts = [],
    isLoadingGetPosts,
    isErrorGetPosts,
  } = usePostsHook({ structure: true });

  const [array, setArray] = useState([]);

  useEffect(() => {
    setArray(_.cloneDeep(allPosts));
  }, [allPosts]);

  return (
    <div className={classes.wrapper}>
      <Header> Схема компании</Header>

      <div className={classes.body}>
        <PostTree posts={array} />
        {/* <div className={classes.wrapperBlock}>
          <PostTree posts={array} />
        </div> */}
      </div>
    </div>
  );
}
