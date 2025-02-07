import React from "react";
import classes from "./TableCheckBox.module.css";

export default function TableCheckBox({nameTable, array, arrayItem, arrayCheked, handleChecboxChange}) {
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>{nameTable}</th>
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
                  {item[arrayItem]}
                </div>
              ))}
            </td>
          </tr>
        </tbody>

    </table>
  );
}
