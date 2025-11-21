import React, { useState } from "react";
import classes from "./BlockSchema.module.css";
import palette from "@image/color_palette.svg";
import { Popover } from "antd";
import _ from "lodash";
import { Button, Tooltip } from "antd";
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
  const [hoveredPostId, setHoveredPostId] = useState(null);

  const backgroundColor = lightenColor(baseColor, level * 0.2);

  const handleOpenPostButtonClick = (event, element) => {
    event.stopPropagation(); // Останавливаем всплытие события
    const newElement = _.cloneDeep(element);
    newElement.color = baseColor;
    // //(newElement);
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

  const handleMouseEnter = (e) => {
    setHoveredPostId(post.id);
  };

  const handleMouseLeave = (e) => {
    setHoveredPostId(null);
  };

  return (
    <div
      className={classes.childBlock}
      style={{ backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classes.nameBlock}>
        {hoveredPostId === post.id && (
          <div className={classes.controlsBlock}>
            <DrawerUpdatePost postId={post.id} />
          </div>
        )}

        <Tooltip
          title={post.divisionName}
          placement="top"
          mouseEnterDelay={0.3}
        >
          <Button
            type="link"
            onClick={(event) => {
              handleOpenPostButtonClick(event, post);
            }}
            style={{
              display: "inline-block",
              maxWidth: "340px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.divisionName}
          </Button>
        </Tooltip>

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
  let colorPostFromBD = arrayColors?.get(post.id);

  const [selectedColor, setSelectedColor] = useState(
    colorPostFromBD || "#BFCFE7"
  );

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
    newElement.color = colorPostFromBD || selectedColor;
    // //(newElement);
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
      style={{ backgroundColor: colorPostFromBD || selectedColor }}
    >
      <div
        className={classes.block}
        style={{ backgroundColor: colorPostFromBD || selectedColor }}
      >
        <div
          className={classes.controlsBlock}
          style={{
            display: "none", // По умолчанию скрыт
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          {arrayColors !== null ? (
            <Popover
              placement="topLeft"
              content={
                <ColorPickerModal
                  onColorSelect={handleColorSelect}
                  selectedColor={selectedColor}
                  colorFromBD={colorPostFromBD}
                />
              }
            >
              <div className={classes.controlItem}>
                <img
                  data-tour="color-palette"
                  src={palette}
                  alt="palette"
                  width="30px"
                  height="30px"
                />
              </div>
            </Popover>
          ) :(null)}

          <DrawerUpdatePost postId={post.id}></DrawerUpdatePost>
        </div>

        <div className={classes.nameBlock}>
          <Tooltip
            title={post.divisionName}
            placement="top"
            mouseEnterDelay={0.3}
          >
            <Button
              type="link"
              onClick={() => {
                handleOpenPostButtonClick(post);
              }}
              style={{
                display: "inline-block",
                maxWidth: "340px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.divisionName}
            </Button>
          </Tooltip>

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
                baseColor={colorPostFromBD || selectedColor}
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
