import React, { useState } from "react";
import classes from "./BlockSchema.module.css";
import palette from "@image/color_palette.svg";
import { Popover } from "antd";
import _ from "lodash";
import { Button } from "antd";
import Drawer from "../drawer/Drawer";

const colors = [
  "#A8D5BA",
  "#C1E1C1",
  "#EDEEC9",
  "#F7D9C4",
  "#E8A09A",
  "#D5B9B2",
  "#B5CDA3",
  "#C6D8AF",
  "#E1E3D8",
  "#F4B9A5",
  "#E4C1F9",
  "#A7C4BC",
  "#F2D7D9",
  "#D6DAC8",
  "#F5E1DA",
  "#C9CCD5",
  "#F8E5E5",
  "#FFE5D9",
  "#B0C4DE",
  "#D4A5A5",
  "#E5D4E8",
  "#A3B18A",
  "#DAD7CD",
  "#FAEDCD",
  "#BFCFE7",
  "#C9E4CA",
  "#E0E1DD",
  "#FFE0AC",
  "#A3C1AD",
  "#D8E2DC",
  "#D4E09B",
  "#D4B5B0",
];

const lightenColor = (color, factor) => {
  if (!color || typeof color !== "string" || !color.startsWith("#")) {
    return "#ffffff"; // Дефолтный белый цвет, если цвет невалиден
  }

  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * factor));
  g = Math.min(255, Math.floor(g + (255 - g) * factor));
  b = Math.min(255, Math.floor(b + (255 - b) * factor));

  return `rgb(${r}, ${g}, ${b})`;
};

const ColorPickerModal = ({ onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  return (
    <div>
      <div style={styles.colorGrid}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              ...styles.colorBox,
              backgroundColor: color,
              border:
                selectedColor === color ? "3px solid black" : "1px solid #ccc",
            }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "10px",
    margin: "20px 0",
  },
  colorBox: {
    width: "30px",
    height: "30px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "border 0.2s ease",
  },
};

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
      <Drawer postId={post.id}></Drawer>
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
    newElement.color = selectedColor || arrayColors.get(post.id);
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
      style={{ backgroundColor: selectedColor || arrayColors.get(post.id) }}
    >
      <div
        className={classes.block}
        style={{ backgroundColor: selectedColor || arrayColors.get(post.id) }}
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
            content={<ColorPickerModal onColorSelect={handleColorSelect} />}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <img src={palette} alt="palette" width="30px" height="30px" />
            </div>
          </Popover>
          <Drawer postId={post.id}></Drawer>
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
                baseColor={selectedColor || arrayColors.get(post.id)}
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
