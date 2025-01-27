import React from "react";
import classes from "./ModalFolder.module.css";
import deleteGrey from "../../image/deleteGrey.svg";
import exitModal from "../../image/exitModal.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import Input from "@Custom/Input/Input";
import ButtonImage from "@Custom/buttonImage/ButtonImage";

export default function ModalFolder({
  searchArrayDirectives,
  searchArrayInstructions,
  arrayDirectives,
  arrayInstructions,
  inputSearchModalDirectory,
  handleInputChangeModalSearch,
  handleCheckboxChange,
  directoryName,
  setDirectoryName,
  save,
  setOpenModalDeleteDirectory,
  exit,
  buttonDelete,
}) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitModal"
          onClick={exit}
          className={classes.exit}
        />

        <div className={classes.header}>
          <div className={classes.item1}>
            <input
              type="search"
              placeholder="Найти"
              value={inputSearchModalDirectory}
              onChange={handleInputChangeModalSearch}
              className={classes.search}
            />
          </div>

          <div className={classes.item2}>
            <Input
              name={"Название папки"}
              value={directoryName}
              onChange={setDirectoryName}
            ></Input>

            <div className={classes.modalTableRowIcon}>
              <ButtonImage
                name={"сохранить"}
                icon={Blacksavetmp}
                onClick={save}
              ></ButtonImage>
              {buttonDelete && (
                <ButtonImage
                  name={"удалить"}
                  icon={deleteGrey}
                  onClick={() => {
                    setOpenModalDeleteDirectory(true);
                  }}
                ></ButtonImage>
              )}
            </div>
          </div>
        </div>

        <table className={classes.table}>
          <thead>
            <tr>
              <th>Директивы</th>
              <th>Инструкции</th>
            </tr>
          </thead>

          {searchArrayDirectives.length > 0 ||
          searchArrayInstructions.length > 0 ? (
            <tbody>
              <tr>
                <td>
                  {searchArrayDirectives?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "directives")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
                    </div>
                  ))}
                </td>

                <td>
                  {searchArrayInstructions?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "instructions")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>
                  {arrayDirectives?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "directives")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
                    </div>
                  ))}
                </td>

                <td>
                  {arrayInstructions?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "instructions")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
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
