import React from "react";
import exit from "../../image/exitModal.svg";
import classes from "./Modal.module.css";

export default function Modal({ array, exitModal, handleCheckBoxModal, selectProjectsModalId }) {
  return (
    <div className={classes.modal}>
      <table className={classes.modalTable}>
     
        <img
          src={exit}
          alt="exit"
          onClick={ () => exitModal(false)}
          className={classes.exitImage}
        />

        <thead>
          <tr>
            <th>Название проекта</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {array?.map((item) => (
                <div
                  key={item.id}
                  className={classes.row}
                  onClick={() => handleCheckBoxModal(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectProjectsModalId?.includes(item.id)}
                  />
                  {item.nameProject}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
