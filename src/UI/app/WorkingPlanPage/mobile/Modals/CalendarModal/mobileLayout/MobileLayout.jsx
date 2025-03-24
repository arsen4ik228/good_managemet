import React from "react";
import classes from "./MobileLayout.module.css";
import ModalContainer from "@Custom/ModalContainer/ModalContainer";
import calenderIcon from "@Custom/icon/icon _ calendar.svg";

export default function MobileLayout({
  openModal,
  setOpenModal,
  dateStart,
  setDateStart,
  dateDeadline,
  setDateDeadline,
  disableDateStart,
}) {
  return (
    <>
      <img
        src={calenderIcon}
        alt="calenderIcon"
        onClick={() => setOpenModal(true)}
      />

      {openModal ? (
        <ModalContainer buttonText={"Сохранить"} setOpenModal={setOpenModal}>
          <div className={classes.Content}>
            <input
              className={classes.dateStart}
              type="date"
              value={dateStart}
              disabled={disableDateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
            <input
              className={classes.deadline}
              type="date"
              value={dateDeadline}
              onChange={(e) => setDateDeadline(e.target.value)}
            />
          </div>
        </ModalContainer>
      ) : (
        <></>
      )}
    </>
  );
}
