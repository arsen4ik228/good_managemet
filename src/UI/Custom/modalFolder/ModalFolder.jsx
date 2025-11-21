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
  searchArrayDisposals,

  arrayDirectives,
  arrayInstructions,
  arrayDisposals,

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
  const renderDirectives = () => {
    const directivesToRender =
      searchArrayDirectives.length > 0
        ? searchArrayDirectives
        : arrayDirectives;

    return directivesToRender?.map((item) => {
         //("item", item);
      return(
      <div
        key={item.id}
        className={classes.row}
        onClick={() => handleCheckboxChange(item.id, "directives")}
      >
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => e.stopPropagation()}
        />
        <span>{item.policyName}</span>
      </div>
    )
    }
    );
  };

  const renderInstructions = () => {
    const instructionsToRender =
      searchArrayInstructions.length > 0
        ? searchArrayInstructions
        : arrayInstructions;

    return instructionsToRender?.map((item) => (
      <div
        key={item.id}
        className={classes.row}
        onClick={() => handleCheckboxChange(item.id, "instructions")}
      >
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => e.stopPropagation()}
        />
        <span>{item.policyName}</span>
      </div>
    ));
  };

  const renderDisposals = () => {
    const disposalsToRender =
      searchArrayDisposals.length > 0 ? searchArrayDisposals : arrayDisposals;

    return disposalsToRender?.map((item) => (
      <div
        key={item.id}
        className={classes.row}
        onClick={() => handleCheckboxChange(item.id, "disposals")}
      >
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => e.stopPropagation()}
        />
        <span>{item.policyName}</span>
      </div>
    ));
  };

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
            />

            <div className={classes.modalTableRowIcon}>
              <ButtonImage
                name={"сохранить"}
                icon={Blacksavetmp}
                onClick={save}
              />
              {buttonDelete && (
                <ButtonImage
                  name={"удалить"}
                  icon={deleteGrey}
                  onClick={() => setOpenModalDeleteDirectory(true)}
                />
              )}
            </div>
          </div>
        </div>

        <div className={classes.tablesContainer}>
          {/* Таблица директив */}
          <div className={classes.tableWrapper}>
            <div className={classes.tableHeader}>Директивы</div>
            <div className={classes.tableContent}>
              <div className={classes.scrollContent}>{renderDirectives()}</div>
            </div>
          </div>

          {/* Таблица инструкций */}
          <div className={classes.tableWrapper}>
            <div className={classes.tableHeader}>Инструкции</div>
            <div className={classes.tableContent}>
              <div className={classes.scrollContent}>
                {renderInstructions()}
              </div>
            </div>
          </div>

          {/* Таблица распоряжения */}
          <div className={classes.tableWrapper}>
            <div className={classes.tableHeader}>Распоряжения</div>
            <div className={classes.tableContent}>
              <div className={classes.scrollContent}>
                {renderDisposals()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
