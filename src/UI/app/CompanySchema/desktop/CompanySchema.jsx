import React, { useState, useEffect } from "react";
import classes from "./CompanySchema.module.css";
import Headers from "@Custom/Headers/Headers";
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
    <div className={classes.dialog}>
      <Headers name={"схема компании"}></Headers>

      <div className={classes.main}>
        <h1>Валерий Директор</h1>
        <div className={classes.wrapper}>
          <PostTree posts={array} />
        </div>
      </div>
    </div>
  );
}
