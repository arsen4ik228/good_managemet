import React, { useState, useEffect } from "react";
import classes from "./CompanySchema.module.css";

import _ from "lodash";
import { FloatButton } from "antd";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders.jsx";

import PostSchema from "./postSchema/PostSchema";
import BlockSchema from "./blockSchema/BlockSchema";

import { usePostsHook } from "@hooks/usePostsHook";
import { useOrganizationHook } from "@hooks/useOrganizationHook";
import arrowBack from "@image/back_white.svg";
import DrawerCreatePost from "./drawer/DrawerCreatePost";

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

const PostTree = ({
  posts,
  arrayColors,
  setArrayColors,
  setOnePost,
  setViewChildrenPost,
  setHeader,
}) => {
  const tree = buildTree(posts);
  console.log(tree);
  return (
    <div className={classes.wrapper}>
      {tree.map((post) => (
        <BlockSchema
          key={post.id}
          post={post}
          arrayColors={arrayColors}
          setArrayColors={setArrayColors}
          setOnePost={setOnePost}
          setViewChildrenPost={setViewChildrenPost}
          setHeader={setHeader}
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
  const [onePost, setOnePost] = useState([]);
  const [arrayColors, setArrayColors] = useState(new Map());
  const [isViewChildrenPost, setViewChildrenPost] = useState(false);
  const [header, setHeader] = useState({
    postName: "",
    divisionName: "",
    fullName: "",
  });

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
    if (
      currentOrganization?.colorCodes &&
      typeof currentOrganization.colorCodes === "object"
    ) {
      setArrayColors(new Map(Object.entries(currentOrganization.colorCodes)));
    }
  }, [currentOrganization]);

  const [openCreatePost, setOpenCreatePost] = useState(false);
  const createPost = () => {
    setOpenCreatePost(true);
  };
  // console.log(onePost);
  return (
    <div className={classes.dialog}>
      <Headers name={"схема компании"}>
        <BottomHeaders update={saveUpdateOrganization} create={createPost} />
      </Headers>

      <DrawerCreatePost open={openCreatePost} setOpen={setOpenCreatePost}></DrawerCreatePost>

      <div className={classes.main}>
        <div className={classes.header}>
          <h1 className={classes.boldText}>{header.postName}</h1>
          <h2 className={classes.boldText}>{header.divisionName}</h2>
          <h3>{header.fullName}</h3>
        </div>

        <div className={classes.wrapper}>
          {isViewChildrenPost ? (
            <>
              {onePost[0]?.children?.map((item) => {
                return (
                  <>
                    <PostSchema
                      key={item.id}
                      post={item}
                      backgroundColor={onePost[0].color}
                      setOnePost={setOnePost}
                      setViewChildrenPost={setViewChildrenPost}
                      setHeader={setHeader}
                    />

                    <FloatButton
                      icon={
                        <img
                          src={arrowBack}
                          alt="back"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      type="primary"
                      tooltip="Вернуться назад"
                      onClick={() => setViewChildrenPost(false)}
                      style={{
                        insetInlineEnd: 94,
                      }}
                    />
                  </>
                );
              })}
            </>
          ) : (
            <>
              <PostTree
                posts={arrayAllPosts}
                arrayColors={arrayColors}
                setArrayColors={setArrayColors}
                setOnePost={setOnePost}
                setViewChildrenPost={setViewChildrenPost}
                setHeader={setHeader}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
