import React from "react";
import classes from "./Panel.module.css";
export default function Panel() {
  return (
    <div className={classes.block}>
      <div className={classes.row}>
      <svg width="25.000000" height="25.000000" viewBox="0 0 25 25" fill="none">
        <desc>Created with Pixso.</desc>
        <defs>
          <clipPath id="clip13_1450">
            <rect
              id="list / exit"
              width="25.000000"
              height="25.000000"
              fill="white"
              fill-opacity="0"
            />
          </clipPath>
        </defs>
        <g clip-path="url(#clip13_1450)">
          <path
            id="Vector"
            d="M17.7 15.99L21.16 12.42L17.7 8.85"
            stroke="#FFFFFF"
            stroke-opacity="0.640000"
            stroke-width="4.000000"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <path
            id="Vector"
            d="M19.27 12.5L10.41 12.5"
            stroke="#FFFFFF"
            stroke-opacity="0.640000"
            stroke-width="4.000000"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <path
            id="Vector"
            d="M12.93 4.16L5.5 4.16C4.47 4.17 3.64 5.23 3.64 6.55L3.64 18.45C3.64 19.76 4.47 20.83 5.5 20.83L13.02 20.83"
            stroke="#FFFFFF"
            stroke-opacity="0.640000"
            stroke-width="4.000000"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </g>
      </svg>
      <span>выйти</span>
      </div>
    </div>
  );
}
