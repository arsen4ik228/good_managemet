import React from "react";
import classes from "./PostSchema.module.css";
import _ from "lodash";
import { Button } from "antd";

import { lightenColor } from "../../constants/contsants.js";

const PodSchema = ({ post, level = 1, baseColor, setOnePost, setViewChildrenPost, setHeader }) => {
  const backgroundColor = lightenColor(baseColor, level * 0.2);

  const handleOpenPostButtonClick = (event, element) => {
    event.stopPropagation(); // Останавливаем всплытие события
    const newElement = _.cloneDeep(element);
    newElement.color = backgroundColor;
    console.log(newElement);
    setOnePost([newElement]);
    setHeader({
      postName: post?.postName ?? "Не указано",
      divisionName: post?.divisionName ?? "Не указано",
      fullName: post?.user ? `${post.user.firstName ?? ""} ${post.user.lastName ?? ""}`.trim() : "Нет пользователя",
    });
    setViewChildrenPost(true);
  };

  return (
    <div className={classes.childBlock} style={{ backgroundColor }}>
      <div className={classes.nameBlock}>
        <Button
          type="link"
          onClick={(event) => {
            handleOpenPostButtonClick(event, post);
          }}
        >
          {post?.divisionName}
        </Button>
        <h2>{post.postName}</h2>
        {post.user ? (
          <h3>
            {post?.user.firstName} {post?.user.lastName}
          </h3>
        ) : (
          <h3>Пост свободен</h3>
        )}
      </div>
      {post?.children.length > 0 && (
        <div className={classes.childBlock}>
          {post.children.map((child) => (
            <PodSchema
              key={child.id}
              post={child}
              level={level > 2 ? 1 : level + 1}
              baseColor={baseColor}
              setOnePost={setOnePost}
              setViewChildrenPost={setViewChildrenPost}
              setHeader={setHeader}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function PostSchema({ post, backgroundColor, setOnePost, setViewChildrenPost, setHeader }) {
  const handleOpenPostButtonClick = (element) => {
    const newElement = _.cloneDeep(element);
    newElement.color = backgroundColor;
    console.log(newElement);
    setOnePost([newElement]);
    setHeader({
      postName: post?.postName ?? "Не указано",
      divisionName: post?.divisionName ?? "Не указано",
      fullName: post?.user ? `${post.user.firstName ?? ""} ${post.user.lastName ?? ""}`.trim() : "Нет пользователя",
    });
    setViewChildrenPost(true);
  };

  return (
    <div className={classes.wrapper} style={{ backgroundColor }}>
      <div className={classes.block} style={{ backgroundColor }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        ></div>

        <div className={classes.nameBlock}>
          <Button
            type="link"
            onClick={() => {
              handleOpenPostButtonClick(post);
            }}
          >
            {post?.divisionName}
          </Button>
          <h2>{post?.postName}</h2>
          {post?.user && (
            <h3>
              {post?.user?.firstName} {post?.user?.lastName}
            </h3>
          )}
        </div>

        {post?.children.length > 0 && (
          <div className={classes.childBlock}>
            {post?.children.map((child) => (
              <PodSchema
                key={child.id}
                post={child}
                baseColor={backgroundColor}
                setOnePost={setOnePost}
                setViewChildrenPost={setViewChildrenPost}
                setHeader={setHeader}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
