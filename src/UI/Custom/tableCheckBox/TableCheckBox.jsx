import React from "react";
import classes from "./TableCheckBox.module.css";

export default function TableCheckBox({name, array, arrayCheked, handleChecboxChange}) {
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>{name}</th>
        </tr>
      </thead>

        <tbody>
          <tr>
            <td>
              {array?.map((item) => (
                <div
                  key={item.id}
                  className={classes.row}
                  onClick={() => handleChecboxChange(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={arrayCheked.includes(item.id)}
                  />
                  {item.name}
                </div>
              ))}
            </td>
          </tr>
        </tbody>

    </table>
  );
}
