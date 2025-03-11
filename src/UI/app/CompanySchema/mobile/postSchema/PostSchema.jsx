import React from "react";

import _ from "lodash";
import { Button, Collapse } from "antd";

import { lightenColor } from "../../constants/contsants.js";
import  DrawerUpdatePost  from "../../drawer/drawerForPost/DrawerUpdatePost";

const { Panel } = Collapse;

const PodSchema = ({
  post,
  level = 1,
  baseColor,
  setOnePost,
  setViewChildrenPost,
  setHeader,
}) => {
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
      fullName: post?.user
        ? `${post.user.firstName ?? ""} ${post.user.lastName ?? ""}`.trim()
        : "Нет пользователя",
    });
    setViewChildrenPost(true);
  };

  return (
    <Collapse
      style={{ backgroundColor, borderRadius: "10px", marginBottom: "10px" }}
    >
      <Panel
        header={
          <div
            style={{
              width:"100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="link"
              onClick={(event) => {
                handleOpenPostButtonClick(event, post);
              }}
              style={{
                display: "block",
                width: "85%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "left",
                textOverflow: "ellipsis",
              }}
            >
              {post.postName}
            </Button>

            <DrawerUpdatePost postId={post.id}></DrawerUpdatePost>
          </div>
        }
        key={post.id}
        showArrow={post.underPosts.length > 0}
        style={{ backgroundColor, padding: "10px", borderRadius: "10px" }}
      >
        {post.children.length > 0 && (
          <>
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
          </>
        )}
      </Panel>
    </Collapse>
  );
};

export default function PostSchema({
  post,
  backgroundColor,
  setOnePost,
  setViewChildrenPost,
  setHeader,
}) {
  const handleOpenPostButtonClick = (event, element) => {
    event.stopPropagation(); // Останавливаем всплытие события
    const newElement = _.cloneDeep(element);
    newElement.color = backgroundColor;
    console.log(newElement);
    setOnePost([newElement]);
    setHeader({
      postName: post?.postName ?? "Не указано",
      divisionName: post?.divisionName ?? "Не указано",
      fullName: post?.user
        ? `${post.user.firstName ?? ""} ${post.user.lastName ?? ""}`.trim()
        : "Нет пользователя",
    });
    setViewChildrenPost(true);
  };

  return (
    <Collapse
      style={{ backgroundColor, borderRadius: "10px", marginBottom: "10px" }}
    >
      <Panel
        header={
          <div
            style={{
              width:"80vw",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="link"
              onClick={(event) => {
                handleOpenPostButtonClick(event, post);
              }}
              style={{
                display: "block",
                width: "65%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "left",
                textOverflow: "ellipsis",
              }}
            >
              {post.postName}
            </Button>

            <DrawerUpdatePost postId={post.id}></DrawerUpdatePost>
          </div>
        }
        key={post.id}
        showArrow={post.underPosts.length > 0}
        style={{ backgroundColor, padding: "10px", borderRadius: "10px" }}
      >
        {post?.children.length > 0 && (
          <>
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
          </>
        )}
      </Panel>
    </Collapse>
  );
}
