import React from "react";
import classes from "./ModalSelectCheckBox.module.css";
import exitModal from "@image/exitModal.svg";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";

export function ModalSelectCheckBox({
  nameTable,
  handleSearchValue,
  handleSearchOnChange,
  exit,
  filterArray,
  array,
  arrayItem,
  save,
  
  handleChecboxChange,
  arrayChecked,
  nameBtn,
  iconBtn,
}) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitModal"
          onClick={() => exit()}
          className={classes.exit}
        />

        <div className={classes.header}>
          <div className={classes.item1}>
            <input
              type="search"
              placeholder="Найти"
              value={handleSearchValue}
              onChange={handleSearchOnChange}
              className={classes.search}
            />
          </div>

          {save && (
            <div className={classes.item2}>
              <ButtonImage
                name={nameBtn ? nameBtn : "сохранить"}
                icon={iconBtn ? iconBtn : Blacksavetmp}
                onClick={save}
              ></ButtonImage>
            </div>
          )}
        </div>

        <table className={classes.table}>
          <thead>
            <tr>
              <th>{nameTable}</th>
            </tr>
          </thead>

          {filterArray.length > 0 ? (
            <tbody>
              <tr>
                <td>
                  {filterArray?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() => handleChecboxChange(item.id, item)}
                    >
                      <input
                       type="checkbox"
                       checked={arrayChecked?.includes(item.id)}
                      />
                      {item[arrayItem]}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>
                  {array?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() => handleChecboxChange(item.id, item)}
                    >
                      <input
                         type="checkbox"
                         checked={arrayChecked?.includes(item.id)}
                      />
                      {item[arrayItem]}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
