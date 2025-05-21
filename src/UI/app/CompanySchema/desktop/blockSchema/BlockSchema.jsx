import React, { useState } from "react";
import classes from "./BlockSchema.module.css";
import palette from "@image/color_palette.svg";
import { Popover } from "antd";
import _ from "lodash";
import { Button } from "antd";
import DrawerUpdatePost from "../../drawer/drawerForPost/DrawerUpdatePost";
import { lightenColor, ColorPickerModal } from "../../constants/contsants.js";

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
    newElement.color = baseColor;
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
    <div className={classes.childBlock} style={{ backgroundColor }}>
      
      <div className={classes.nameBlock}>
      <DrawerUpdatePost postId={post.id}></DrawerUpdatePost>
        <Button
          type="link"
          onClick={(event) => {
            handleOpenPostButtonClick(event, post);
          }}
        >
          {post.divisionName}
        </Button>
        <h2>{post.postName}</h2>
        {post.user ? (
          <h3>
            {post.user.firstName} {post.user.lastName}
          </h3>
        ) : (
          <h3>Пост свободен</h3>
        )}
      </div>
      {post.children.length > 0 && (
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

export default function BlockSchema({
  post,
  arrayColors,
  setArrayColors,
  setOnePost,
  setViewChildrenPost,
  setHeader,
}) {

  let colorPostFromBD = arrayColors.get(post.id);

  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setArrayColors((prevState) => {
      const newMap = new Map(prevState);
      newMap.set(post.id, color);
      return newMap;
    });
  };

  const handleOpenPostButtonClick = (element) => {
    const newElement = _.cloneDeep(element);
    newElement.color = selectedColor || colorPostFromBD;
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
    <div
      className={classes.wrapper}
      style={{ backgroundColor: selectedColor || colorPostFromBD }}
    >
      <div
        className={classes.block}
        style={{ backgroundColor: selectedColor || colorPostFromBD }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <Popover
            placement="topLeft"
            content={<ColorPickerModal onColorSelect={handleColorSelect} selectedColor = {selectedColor} colorFromBD = {colorPostFromBD}/>}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <img  data-tour="color-palette" src={palette} alt="palette" width="30px" height="30px" />
            </div>
          </Popover>
          <DrawerUpdatePost postId={post.id}></DrawerUpdatePost>
        </div>

        <div className={classes.nameBlock}>
          <Button
            type="link"
            onClick={() => {
              handleOpenPostButtonClick(post);
            }}
          >
            {post.divisionName}
          </Button>
          <h2>{post.postName}</h2>
          {post.user && (
            <h3>
              {post.user.firstName} {post.user.lastName}
            </h3>
          )}
        </div>

        {post.children.length > 0 && (
          <div className={classes.childBlock}>
            {post.children.map((child) => (
              <PodSchema
                key={child.id}
                post={child}
                baseColor={selectedColor || colorPostFromBD}
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
