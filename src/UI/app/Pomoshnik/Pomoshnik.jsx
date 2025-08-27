import React, { useState, useEffect } from "react";
import classes from "./Pomoshnik.module.css";
import icon from "@image/iconHeader.svg";
import { useNavigate } from "react-router-dom";

export default function Pomoshnik() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const goal = () => {
    navigate(`/pomoshnik/goal`);
  };
  const policy = () => {
    navigate(`/pomoshnik/policy`);
  };
  const post = () => {
    navigate(`/pomoshnik/post`);
  };
  const strateg = () => {
    navigate(`/pomoshnik/strategy`);
  };
  const statistics = () => {
    navigate(`/pomoshnik/statistic`);
  };
  const svodka = () => {
    navigate(`/pomoshnik/svodka`);
  };
  const project = () => {
    navigate(`/pomoshnik/projectWithProgramm`);
  };
  const workingPlan = () => {
    navigate(`/pomoshnik/workingPlan`);
  };
  const companySchema = () => {
    navigate(`/pomoshnik/companySchema`);
  };
  const menuItems = [
    {
      title: "ЦЕЛИ",
      icon: (
        <svg
          width="20.000000"
          height="19.000000"
          viewBox="0 0 20 19"
          fill="none"
        >
          <desc>Created with Pixso.</desc>
          <defs />
          <path
            id="Vector"
            d="M10 15.27L16.18 19L14.54 11.97L20 7.23L12.81 6.62L10 0L7.19 6.62L0 7.23L5.45 11.97L3.82 19L10 15.27Z"
            fill="#ffff"
            fill-opacity="1.000000"
            fill-rule="nonzero"
          />
        </svg>
      ),
      onClick: goal,
    },
    {
      title: "ПОЛИТИКА",
      icon: (
        <svg
          width="24.608887"
          height="24.608887"
          viewBox="0 0 24.6089 24.6089"
          fill="none"
        >
          <desc>Created with Pixso.</desc>
          <defs />
          <rect
            id="icon /policy"
            width="24.000000"
            height="24.000000"
            fill="#FFFFFF"
            fill-opacity="0"
          />
          <path
            id="Vector"
            d="M4.33 1.33L19.66 1.33C20.21 1.33 20.66 1.78 20.66 2.33L20.66 20.99C20.66 21.55 20.21 21.99 19.66 21.99L4.33 21.99C3.78 21.99 3.33 21.55 3.33 20.99L3.33 2.33C3.33 1.78 3.78 1.33 4.33 1.33Z"
            fill="#FFFFFF"
            fill-opacity="1.000000"
            fill-rule="evenodd"
          />
          <path
            id="Vector"
            d="M4.33 1.33L19.66 1.33C20.21 1.33 20.66 1.78 20.66 2.33L20.66 20.99C20.66 21.55 20.21 21.99 19.66 21.99L4.33 21.99C3.78 21.99 3.33 21.55 3.33 20.99L3.33 2.33C3.33 1.78 3.78 1.33 4.33 1.33ZM4.33 2.33L19.66 2.33L19.66 20.99L4.33 20.99L4.33 2.33Z"
            fill="#005475"
            fill-opacity="1.000000"
            fill-rule="evenodd"
          />
          <path
            id="Vector 24"
            d="M8 7.33L16.66 7.33"
            stroke="#005475"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linecap="round"
          />
          <path
            id="Vector 25"
            d="M7.33 9.99L16.66 9.99"
            stroke="#005475"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linecap="round"
          />
          <path
            id="Vector 26"
            d="M7.33 12.66L16.66 12.66"
            stroke="#005475"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linecap="round"
          />
          <path
            id="Vector 27"
            d="M7.33 15.33L16.66 15.33"
            stroke="#005475"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linecap="round"
          />
        </svg>
      ),
      onClick: policy,
    },
    {
      title: "СТАТИСТИКА",
      icon: (
        <svg
          width="24.000000"
          height="24.000000"
          viewBox="0 0 24 24"
          fill="none"
        >
          <desc>Created with Pixso.</desc>
          <defs>
            <clipPath id="clip26_1363">
              <rect
                id=" icon / stats"
                width="24.000000"
                height="24.000000"
                fill="white"
                fill-opacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id=" icon / stats"
            width="24.000000"
            height="24.000000"
            fill="#FFFFFF"
            fill-opacity="0"
          />
          <g clip-path="url(#clip26_1363)">
            <path
              id="Vector"
              d="M14.33 11.39L13.93 10.52L13.07 10.13C12.6 9.91 12.6 9.25 13.07 9.03L13.93 8.64L14.33 7.79C14.54 7.32 15.2 7.32 15.42 7.79L15.81 8.65L16.67 9.05C17.13 9.26 17.13 9.92 16.67 10.14L15.8 10.53L15.41 11.39C15.2 11.85 14.53 11.85 14.33 11.39ZM4.61 13.79L5 12.92L5.87 12.53C6.33 12.31 6.33 11.65 5.87 11.43L5 11.05L4.61 10.19C4.4 9.72 3.73 9.72 3.53 10.19L3.13 11.05L2.27 11.45C1.8 11.65 1.8 12.32 2.27 12.53L3.13 12.92L3.53 13.79C3.73 14.25 4.4 14.25 4.61 13.79ZM8.81 8.99L9.39 7.71L10.67 7.13C11.13 6.91 11.13 6.25 10.67 6.03L9.39 5.46L8.81 4.19C8.6 3.72 7.93 3.72 7.73 4.19L7.14 5.46L5.87 6.05C5.4 6.25 5.4 6.92 5.87 7.13L7.14 7.71L7.73 8.99C7.93 9.45 8.6 9.45 8.81 8.99ZM21.99 8.99C21.62 8.65 21.06 8.69 20.72 9.06L14.59 15.96L11.52 12.89C11.05 12.42 10.29 12.42 9.83 12.89L4.11 18.61C3.77 18.96 3.77 19.53 4.11 19.88C4.46 20.23 5.04 20.23 5.39 19.88L10.67 14.59L13.76 17.69C14.25 18.18 15.05 18.15 15.5 17.64L22.07 10.26C22.4 9.89 22.37 9.31 21.99 8.99Z"
              fill="#FFFFFF"
              fill-opacity="0.901961"
              fill-rule="nonzero"
            />
          </g>
        </svg>
      ),
      onClick: statistics,
    },
    {
      title: "СВОДКА",
      icon: (
        <svg
          width="24.000000"
          height="24.000000"
          viewBox="0 0 24 24"
          fill="none"
        >
          <desc>Created with Pixso.</desc>
          <defs>
            <clipPath id="clip26_1363">
              <rect
                id=" icon / stats"
                width="24.000000"
                height="24.000000"
                fill="white"
                fill-opacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id=" icon / stats"
            width="24.000000"
            height="24.000000"
            fill="#FFFFFF"
            fill-opacity="0"
          />
          <g clip-path="url(#clip26_1363)">
            <path
              id="Vector"
              d="M14.33 11.39L13.93 10.52L13.07 10.13C12.6 9.91 12.6 9.25 13.07 9.03L13.93 8.64L14.33 7.79C14.54 7.32 15.2 7.32 15.42 7.79L15.81 8.65L16.67 9.05C17.13 9.26 17.13 9.92 16.67 10.14L15.8 10.53L15.41 11.39C15.2 11.85 14.53 11.85 14.33 11.39ZM4.61 13.79L5 12.92L5.87 12.53C6.33 12.31 6.33 11.65 5.87 11.43L5 11.05L4.61 10.19C4.4 9.72 3.73 9.72 3.53 10.19L3.13 11.05L2.27 11.45C1.8 11.65 1.8 12.32 2.27 12.53L3.13 12.92L3.53 13.79C3.73 14.25 4.4 14.25 4.61 13.79ZM8.81 8.99L9.39 7.71L10.67 7.13C11.13 6.91 11.13 6.25 10.67 6.03L9.39 5.46L8.81 4.19C8.6 3.72 7.93 3.72 7.73 4.19L7.14 5.46L5.87 6.05C5.4 6.25 5.4 6.92 5.87 7.13L7.14 7.71L7.73 8.99C7.93 9.45 8.6 9.45 8.81 8.99ZM21.99 8.99C21.62 8.65 21.06 8.69 20.72 9.06L14.59 15.96L11.52 12.89C11.05 12.42 10.29 12.42 9.83 12.89L4.11 18.61C3.77 18.96 3.77 19.53 4.11 19.88C4.46 20.23 5.04 20.23 5.39 19.88L10.67 14.59L13.76 17.69C14.25 18.18 15.05 18.15 15.5 17.64L22.07 10.26C22.4 9.89 22.37 9.31 21.99 8.99Z"
              fill="#FFFFFF"
              fill-opacity="0.901961"
              fill-rule="nonzero"
            />
          </g>
        </svg>
      ),
      onClick: svodka,
    },
    // {
    //   title: "СТРАТЕГИЯ",
    //   icon: (
    //     <svg
    //       width="18.000000"
    //       height="18.000000"
    //       viewBox="0 0 18 18"
    //       fill="none"
    //     >
    //       <desc>Created with Pixso.</desc>
    //       <defs />
    //       <path
    //         id="Vector"
    //         d="M4.51 3.27L6.54 5.28L5.28 6.54L3.27 4.51L1.25 6.54L0 5.28L2.02 3.27L0 1.25L1.25 0L3.27 2.02L5.28 0L6.54 1.25L4.51 3.27ZM18 12.71L16.74 11.45L14.72 13.48L12.71 11.45L11.45 12.71L13.48 14.72L11.45 16.74L12.71 18L14.72 15.97L16.74 18L18 16.74L15.97 14.72L18 12.71ZM16.4 4.44L13.56 8.11L12.17 6.99L13.2 5.67C11.88 5.94 10.66 6.53 9.63 7.4C8.61 8.26 7.81 9.37 7.33 10.63C8.1 11.18 8.64 11.99 8.86 12.91C9.09 13.83 8.97 14.8 8.55 15.64C8.12 16.48 7.4 17.15 6.53 17.51C5.65 17.87 4.68 17.91 3.78 17.61C2.88 17.32 2.12 16.72 1.62 15.91C1.13 15.1 0.94 14.15 1.09 13.21C1.24 12.28 1.72 11.43 2.44 10.82C3.17 10.21 4.08 9.87 5.03 9.88C5.26 9.88 5.49 9.9 5.72 9.95C6.33 8.43 7.3 7.09 8.55 6.04C9.81 4.99 11.3 4.27 12.9 3.94L11.64 2.98L12.76 1.59L16.4 4.44ZM7.23 13.84C7.23 13.41 7.1 12.98 6.86 12.62C6.62 12.26 6.27 11.97 5.87 11.81C5.47 11.64 5.03 11.6 4.6 11.68C4.17 11.77 3.78 11.98 3.47 12.28C3.16 12.59 2.95 12.99 2.87 13.41C2.78 13.84 2.83 14.28 2.99 14.69C3.16 15.09 3.44 15.43 3.8 15.68C4.17 15.92 4.59 16.05 5.03 16.05C5.61 16.05 6.17 15.81 6.59 15.4C7 14.99 7.23 14.43 7.23 13.84Z"
    //         fill="#FFFFFF"
    //         fill-opacity="0.901961"
    //         fill-rule="nonzero"
    //       />
    //     </svg>
    //   ),
    //   onClick: strateg,
    // },
    {
      title: "ПОСТЫ ",
      icon: (
        <svg
          width="20.000000"
          height="20.000000"
          viewBox="0 0 20 20"
          fill="none"
        >
          <desc>Created with Pixso.</desc>
          <defs />
          <path
            id="Vector"
            d="M5 20C4.46 20 3.96 19.78 3.58 19.41C3.21 19.03 3 18.53 3 18L3 8C3 7.46 3.21 6.96 3.58 6.58C3.96 6.21 4.46 6 5 6L9 6L9 4L8 4C7.73 4 7.48 3.89 7.29 3.7C7.1 3.51 7 3.26 7 3L0 3L0 1L7 1C7 0.73 7.1 0.48 7.29 0.29C7.48 0.1 7.73 0 8 0L12 0C12.26 0 12.51 0.1 12.7 0.29C12.89 0.48 13 0.73 13 1L20 1L20 3L13 3C13 3.26 12.89 3.51 12.7 3.7C12.51 3.89 12.26 4 12 4L11 4L11 6L15 6C16.11 6 17 6.9 17 8L17 18C17 18.53 16.78 19.03 16.41 19.41C16.03 19.78 15.53 20 15 20L5 20ZM10 12.28C11.18 12.28 12.13 11.32 12.13 10.14C12.13 8.95 11.18 8 10 8C8.81 8 7.85 8.95 7.85 10.14C7.85 11.32 8.81 12.28 10 12.28ZM5 16.21C5 14.55 8.33 13.71 10 13.71C11.66 13.71 15 14.55 15 16.21L15 17.28C15 17.67 14.67 18 14.28 18L5.71 18C5.32 18 5 17.67 5 17.28L5 16.21Z"
            fill="#FFFFFF"
            fill-opacity="0.901961"
            fill-rule="evenodd"
          />
        </svg>
      ),
      onClick: post,
    },
    // {
    //   title: "ПРОЕКТЫ ",
    //   icon: (
    //     <svg
    //       width="24.000000"
    //       height="24.000000"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //     >
    //       <desc>Created with Pixso.</desc>
    //       <defs>
    //         <clipPath id="clip26_1336">
    //           <rect
    //             id="icon / list view"
    //             width="24.000000"
    //             height="24.000000"
    //             fill="white"
    //             fill-opacity="0"
    //           />
    //         </clipPath>
    //       </defs>
    //       <rect
    //         id="icon / list view"
    //         width="24.000000"
    //         height="24.000000"
    //         fill="#FFFFFF"
    //         fill-opacity="0"
    //       />
    //       <g clip-path="url(#clip26_1336)">
    //         <path
    //           id="Vector"
    //           d="M3 5L3 19L22 19L22 5L3 5ZM7.47 7L7.47 9L5.23 9L5.23 7L7.47 7ZM5.23 13L5.23 11L7.47 11L7.47 13L5.23 13ZM5.23 15L7.47 15L7.47 17L5.23 17L5.23 15ZM19.76 17L9.7 17L9.7 15L19.76 15L19.76 17ZM19.76 13L9.7 13L9.7 11L19.76 11L19.76 13ZM19.76 9L9.7 9L9.7 7L19.76 7L19.76 9Z"
    //           fill="#FFFFFF"
    //           fill-opacity="1.000000"
    //           fill-rule="nonzero"
    //         />
    //         <rect
    //           id="Rectangle 186"
    //           x="2.000000"
    //           y="4.000000"
    //           rx="2.000000"
    //           width="20.000000"
    //           height="16.000000"
    //           stroke="#005475"
    //           stroke-opacity="1.000000"
    //           stroke-width="2.000000"
    //         />
    //       </g>
    //     </svg>
    //   ),
    //   onClick: project,
    // },
    // {
    //   title: "РАБОЧИЙ ПЛАН",
    //   icon: (
    //     <svg
    //       width="24.000000"
    //       height="24.000000"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //     >
    //       <desc>Created with Pixso.</desc>
    //       <defs>
    //         <clipPath id="clip26_1363">
    //           <rect
    //             id=" icon / stats"
    //             width="24.000000"
    //             height="24.000000"
    //             fill="white"
    //             fill-opacity="0"
    //           />
    //         </clipPath>
    //       </defs>
    //       <rect
    //         id=" icon / stats"
    //         width="24.000000"
    //         height="24.000000"
    //         fill="#FFFFFF"
    //         fill-opacity="0"
    //       />
    //       <g clip-path="url(#clip26_1363)">
    //         <path
    //           id="Vector"
    //           d="M14.33 11.39L13.93 10.52L13.07 10.13C12.6 9.91 12.6 9.25 13.07 9.03L13.93 8.64L14.33 7.79C14.54 7.32 15.2 7.32 15.42 7.79L15.81 8.65L16.67 9.05C17.13 9.26 17.13 9.92 16.67 10.14L15.8 10.53L15.41 11.39C15.2 11.85 14.53 11.85 14.33 11.39ZM4.61 13.79L5 12.92L5.87 12.53C6.33 12.31 6.33 11.65 5.87 11.43L5 11.05L4.61 10.19C4.4 9.72 3.73 9.72 3.53 10.19L3.13 11.05L2.27 11.45C1.8 11.65 1.8 12.32 2.27 12.53L3.13 12.92L3.53 13.79C3.73 14.25 4.4 14.25 4.61 13.79ZM8.81 8.99L9.39 7.71L10.67 7.13C11.13 6.91 11.13 6.25 10.67 6.03L9.39 5.46L8.81 4.19C8.6 3.72 7.93 3.72 7.73 4.19L7.14 5.46L5.87 6.05C5.4 6.25 5.4 6.92 5.87 7.13L7.14 7.71L7.73 8.99C7.93 9.45 8.6 9.45 8.81 8.99ZM21.99 8.99C21.62 8.65 21.06 8.69 20.72 9.06L14.59 15.96L11.52 12.89C11.05 12.42 10.29 12.42 9.83 12.89L4.11 18.61C3.77 18.96 3.77 19.53 4.11 19.88C4.46 20.23 5.04 20.23 5.39 19.88L10.67 14.59L13.76 17.69C14.25 18.18 15.05 18.15 15.5 17.64L22.07 10.26C22.4 9.89 22.37 9.31 21.99 8.99Z"
    //           fill="#FFFFFF"
    //           fill-opacity="0.901961"
    //           fill-rule="nonzero"
    //         />
    //       </g>
    //     </svg>
    //   ),
    //   onClick: workingPlan,
    // },
    // {
    //   title: "СХЕМА КОМПАНИИ",
    //   icon: (
    //     <svg width="25.000000" height="25.000000" viewBox="0 0 25 25" fill="none">
    //     <desc>
    //         Created with Pixso.
    //     </desc>
    //     <defs>
    //       <clipPath id="clip101_2017">
    //         <rect id="list / schema" rx="0.000000" width="24.000000" height="24.000000" transform="translate(0.500000 0.500000)" fill="white" fill-opacity="0"/>
    //       </clipPath>
    //     </defs>
    //     <rect id="list / schema" rx="0.000000" width="24.000000" height="24.000000" transform="translate(0.500000 0.500000)" fill="#FFFFFF" fill-opacity="0"/>
    //     <g clip-path="url(#clip101_2017)">
    //       <path id="Vector" d="M14.37 10.93L14.37 11.56L11.87 11.56L11.87 10.93C11.87 10.25 11.31 9.68 10.62 9.68L9.37 9.68L9.37 8.12L10.62 8.12C11.31 8.12 11.87 7.56 11.87 6.87L11.87 3.75C11.87 3.06 11.31 2.5 10.62 2.5L6.25 2.5C5.56 2.5 5 3.06 5 3.75L5 6.87C5 7.56 5.56 8.12 6.25 8.12L7.5 8.12L7.5 9.68L6.25 9.68C5.56 9.68 5 10.25 5 10.93L5 14.06C5 14.75 5.56 15.31 6.25 15.31L7.5 15.31L7.5 17.5L6.25 17.5C5.56 17.5 5 18.06 5 18.75L5 21.87C5 22.56 5.56 23.12 6.25 23.12L10.62 23.12C11.31 23.12 11.87 22.56 11.87 21.87L11.87 18.75C11.87 18.06 11.31 17.5 10.62 17.5L9.37 17.5L9.37 15.31L10.62 15.31C11.31 15.31 11.87 14.75 11.87 14.06L11.87 13.43L14.37 13.43L14.37 14.06C14.37 14.75 14.93 15.31 15.62 15.31L20 15.31C20.68 15.31 21.25 14.75 21.25 14.06L21.25 10.93C21.25 10.25 20.68 9.68 20 9.68L15.62 9.68C14.93 9.68 14.37 10.25 14.37 10.93Z" fill="#FFFFFF" fill-rule="nonzero"/>
    //     </g>
    //   </svg>

    //   ),
    //   onClick: companySchema,
    // },
  ];

  useEffect(() => {
    const filtered = menuItems.filter((item) =>
      item.title.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={classes.dialog}>
      <div className={classes.header}>
        <div className={classes.fon}></div>
        <div className={classes.pomoshnik}>
          <div>
            <img
              src={icon}
              alt="icon"
              style={{ width: "33px", height: "33px" }}
            />
          </div>
          <div className={classes.spanPomoshnik}>
            <span>Личный помощник</span>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        <div className={classes.mainHeader}>
          <div>
            <img
              src={icon}
              alt="icon"
              style={{ width: "33px", height: "33px" }}
            />
          </div>
          <div className={classes.question}>
            <span>С чем будем работать?</span>
          </div>
        </div>
        <div className={classes.mainBody}>
          {filteredItems.length > 0 ? (
            <>
              {filteredItems.map((item) => (
                <div
                  key={item.title}
                  className={classes.element}
                  onClick={() => item.onClick()}
                >
                  {item.icon}
                  <div>
                    <span>{item.title}</span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className={classes.element}
                  onClick={() => item.onClick()}
                >
                  {item.icon}
                  <div>
                    <span>{item.title}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* <div className={classes.footer}>
        <div className={classes.search}>
          <input
            type="search"
            placeholder="Найти"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div className={classes.telegram}>
          <svg
            width="14.583374"
            height="12.500000"
            viewBox="0 0 14.5834 12.5"
            fill="none"
          >
            <desc>Created with Pixso.</desc>
            <defs />
            <path
              id="Vector"
              d="M0 12.5L14.58 6.25L0 0L0 4.86L10.41 6.25L0 7.63L0 12.5Z"
              fill="#3A3A3A"
              fill-opacity="1.000000"
              fill-rule="evenodd"
            />
          </svg>
        </div>
      </div> */}
    </div>
  );
}
