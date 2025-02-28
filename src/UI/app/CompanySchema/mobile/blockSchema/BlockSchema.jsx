import React, { useState, useEffect } from "react";
import classes from "./BlockSchema.module.css";
import edit from "@image/edit.svg";
import { Popover } from "antd";
import { Collapse } from "antd";

const { Panel } = Collapse;

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



const PodSchema = ({ post, level = 1, baseColor }) => {
  const backgroundColor = lightenColor(baseColor, level * 0.2);

  return (
    <Collapse
      style={{ backgroundColor, borderRadius: "10px", marginBottom: "10px" }}
    >
      <Panel
        header={post.postName}
        key={post.id}
        showArrow={post.underPosts.length > 0}
        style={{ backgroundColor, padding: "10px", borderRadius: "10px" }}
      >
        {level > 2 ? (
          <>
            {post.children.length > 0 && (
              <>
                {post.children.map((child) => (
                  <PodSchema
                    key={child.id}
                    post={child}
                    level={level > 2 ? 1 : level + 1}
                    baseColor={baseColor}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {post.children.length > 0 && (
              <>
                {post.children.map((child) => (
                  <PodSchema
                    key={child.id}
                    post={child}
                    level={level > 2 ? 1 : level + 1}
                    baseColor={baseColor}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Panel>
    </Collapse>
  );
};

export default function BlockSchema({ post, arrayColors, setArrayColors }) {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setArrayColors((prevState) => {
      const newMap = new Map(prevState);
      newMap.set(post.id, color);
      return newMap;
    });
  };

  return (
    <Collapse
      style={{ backgroundColor: selectedColor || arrayColors.get(post.id) }}
    >
      <Panel
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {post.postName}
            <Popover
              placement="bottomRight"
              content={<ColorPickerModal onColorSelect={handleColorSelect} />}
            >
              <img
                src={edit}
                alt="edit"
                width="30px"
                height="30px"
              />
            </Popover>
          </div>
        }
        key={post.id}
        style={{
          backgroundColor: selectedColor,
          padding: "10px",
          borderRadius: "10px",
        }}
        showArrow={post.underPosts.length > 0}
      >
        {post.children.length > 0 && (
          <>
            {post.children.map((child) => (
              <PodSchema
                key={child.id}
                post={child}
                baseColor={selectedColor || arrayColors.get(post.id)}
              />
            ))}
          </>
        )}
      </Panel>
    </Collapse>
  );
}


{
  /* {post.children.length > 0 && (
          <>
            {post.children.map((child) => (
              <PodSchema
                key={child.id}
                post={child}
                level={level > 2 ? 1 : level + 1}
                baseColor={baseColor}
              />
            ))}
          </>
        )} */
}
