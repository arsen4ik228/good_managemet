import React from "react";
import classes from "./ModalSelectRadio.module.css";
import exitModal from "@image/exitModal.svg";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
import ModalContainer from "@Custom/ModalContainer/ModalContainer";

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
    <ModalContainer clickFunction={save} setOpenModal={exit}>
      <div className={classes.wrapper_search}>
        <input
          type="search"
          placeholder="Найти"
          value={handleSearchValue}
          onChange={handleSearchOnChange}
          className={classes.search}
        />
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
                    <input type="radio" checked={selectedItemID === item.id} />
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
                    <input type="radio" checked={selectedItemID === item.id} />
                    {item[arrayItem]}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </ModalContainer>
  );
}
