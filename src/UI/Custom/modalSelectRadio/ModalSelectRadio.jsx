import React from "react";
import classes from "./ModalSelectRadio.module.css";
import exitModal from "@image/exitModal.svg";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";

export function ModalSelectRadio({
  nameTable,
  handleSearchValue,
  handleSearchOnChange,
  exit,
  filterArray,
  array,
  arrayItem,
  selectedItemID,
  handleRadioChange,
  save,
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
                name={"сохранить"}
                icon={Blacksavetmp}
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
                      onClick={() => handleRadioChange(item.id, item)}
                    >
                      <input
                        type="radio"
                        checked={selectedItemID === item.id}
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
                      onClick={() => handleRadioChange(item.id, item)}
                    >
                      <input
                        type="radio"
                        checked={selectedItemID === item.id}
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
