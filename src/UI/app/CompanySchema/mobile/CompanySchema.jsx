import React, { useState, useEffect } from "react";
import classes from "./CompanySchema.module.css";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import Header from "@Custom/CustomHeader/Header";
import BlockSchema from "./blockSchema/BlockSchema";
import { usePostsHook } from "@hooks/usePostsHook";
import _ from "lodash";
import { useOrganizationHook } from "../../../../hooks/useOrganizationHook";

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

const PostTree = ({ posts, arrayColors, setArrayColors }) => {
  const tree = buildTree(posts);

  return (
    <div className={classes.wrapper}>
      {tree.map((post) => (
        <BlockSchema
          key={post.id}
          post={post}
          arrayColors={arrayColors}
          setArrayColors={setArrayColors}
        />
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

  const {
    reduxSelectedOrganizationId,

    currentOrganization,
    isLoadingOrganizationId,
    isFetchingOrganizationId,

    updateOrganization,
    isLoadingUpdateOrganizationMutation,
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    ErrorOrganization,
    localIsResponseUpdateOrganizationMutation,
  } = useOrganizationHook();

  const [arrayAllPosts, setArrayAllPosts] = useState([]);
  const [arrayColors, setArrayColors] = useState(new Map());

  const saveUpdateOrganization = async () => {
    const colorCodes = {};
    for (const [key, value] of arrayColors) {
      colorCodes[key] = value;
    }

    await updateOrganization({
      _id: reduxSelectedOrganizationId,
      colorCodes,
    });
  };

  useEffect(() => {
    setArrayAllPosts(_.cloneDeep(allPosts));
  }, [allPosts]);

  useEffect(() => {
    if (currentOrganization?.colorCodes && typeof currentOrganization.colorCodes === "object") {
      setArrayColors(new Map(Object.entries(currentOrganization.colorCodes)));
    }
  }, [currentOrganization]);
  

  console.log(arrayColors);


  return (
    <div className={classes.wrapper}>
      <Header
        onRightIcon={true}
        rightIcon={Blacksavetmp}
        rightIconClick={saveUpdateOrganization}
      >
        Схема компании
      </Header>

      <div className={classes.body}>
        <PostTree
          posts={arrayAllPosts}
          arrayColors={arrayColors}
          setArrayColors={setArrayColors}
        />
      </div>
    </div>
  );
}
