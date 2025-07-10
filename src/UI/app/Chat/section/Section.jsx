import React, { useEffect, useState } from "react";
import classes from "./Section.module.css";
import { useDispatch } from "react-redux";
import {
  setSelectedOrganizationId,
  setSelectedOrganizationReportDay,
} from "@slices";
import { useGetReduxOrganization, useOrganizationHook } from "@hooks";
import { useNavigate } from "react-router-dom";

export default function Section({ isOrganizationsClosed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizations, isLoadingOrganization, isErrorOrganization } =
    useOrganizationHook();

  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const handleOrganizationNameButtonClick = (id, name, reportDay) => {
    localStorage.setItem("selectedOrganizationId", id);
    localStorage.setItem("name", name);
    localStorage.setItem("reportDay", reportDay);
    dispatch(setSelectedOrganizationId(id));
    dispatch(setSelectedOrganizationReportDay(reportDay));
  };

const handleControlPanelButtonClick = () => {

 window.open('/#/controlPanel', '_blank');
 
  // // Открываем новую вкладку
  // const newWindow = window.open('/#/controlPanel', '_blank');

  // // Ждём, пока вкладка загрузится и запросит токен
  // window.addEventListener('message', (event) => {
  //   // Проверяем, что сообщение пришло с нашего домена
  //   if (event.origin !== window.location.origin) return;

  //   // Если новая вкладка запрашивает токен
  //   if (event.data === 'requestToken') {
  //     // Отправляем токен (например, из localStorage)
  //     newWindow.postMessage(
  //       { type: 'authToken', token: localStorage.getItem('authToken') },
  //       window.location.origin // Важно: указываем origin для безопасности
  //     );
  //   }
  // });
};

  useEffect(() => {
    if (
      !isLoadingOrganization &&
      !isErrorOrganization &&
      organizations?.length > 0
    ) {
      const defaultOrg = organizations[0];
      if (!localStorage.getItem("selectedOrganizationId")) {
        localStorage.setItem("selectedOrganizationId", defaultOrg.id);
        localStorage.setItem("name", defaultOrg.organizationName);
        localStorage.setItem("reportDay", defaultOrg.reportDay);

        // Также обновляем Redux store
        dispatch(setSelectedOrganizationId(defaultOrg.id));
        dispatch(setSelectedOrganizationReportDay(defaultOrg.reportDay));
      }
    }
  }, [organizations, isLoadingOrganization, isErrorOrganization, dispatch]);

  return (
    <>
      {/* <div className={classes.header}>
          <div className={classes.headerName}>организации</div>
          <div className={classes.dropdown}
            onClick={() => setOrganizationsClosed(!isOrganizationsClosed)}
          >
            <img
              src={dropdown}
              alt="dropdown"
              className={`${classes.collapseIcon} ${isOrganizationsClosed ? classes.collapsed : ''
                }`}
            />
          </div>
        </div> */}
      <div className={classes.block}>
        {organizations.map((item) => (
          <React.Fragment key={item.id}>
            {(reduxSelectedOrganizationId === item.id ||
              !isOrganizationsClosed) && (
              <>
                <div
                  className={`${classes.row} ${
                    reduxSelectedOrganizationId === item.id
                      ? classes.row_active
                      : ""
                  }`}
                  onClick={() =>
                    handleOrganizationNameButtonClick(
                      item.id,
                      item.organizationName,
                      item.reportDay
                    )
                  }
                >
                  <svg className={classes.icon}>
                    <path d="M19.66 15.5L17.58 15.5L17.58 17.58L19.66 17.58L19.66 15.5ZM19.66 11.33L17.58 11.33L17.58 13.41L19.66 13.41L19.66 11.33ZM21.75 19.66L13.41 19.66L13.41 17.58L15.5 17.58L15.5 15.5L13.41 15.5L13.41 13.41L15.5 13.41L15.5 11.33L13.41 11.33L13.41 9.25L21.75 9.25L21.75 19.66ZM11.33 7.16L9.25 7.16L9.25 5.08L11.33 5.08L11.33 7.16ZM11.33 11.33L9.25 11.33L9.25 9.25L11.33 9.25L11.33 11.33ZM11.33 15.5L9.25 15.5L9.25 13.41L11.33 13.41L11.33 15.5ZM11.33 19.66L9.25 19.66L9.25 17.58L11.33 17.58L11.33 19.66ZM7.16 7.16L5.08 7.16L5.08 5.08L7.16 5.08L7.16 7.16ZM7.16 11.33L5.08 11.33L5.08 9.25L7.16 9.25L7.16 11.33ZM7.16 15.5L5.08 15.5L5.08 13.41L7.16 13.41L7.16 15.5ZM7.16 19.66L5.08 19.66L5.08 17.58L7.16 17.58L7.16 19.66ZM13.41 7.16L13.41 3L3 3L3 21.75L23.83 21.75L23.83 7.16L13.41 7.16Z" />
                  </svg>
                  <span>{item.organizationName}</span>
                </div>

                {reduxSelectedOrganizationId === item.id && (
                  <div
                    className={classes.controlPanel}
                    onClick={handleControlPanelButtonClick}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M14.33 11.39L13.93 10.52L13.07 10.13C12.6 9.91 12.6 9.25 13.07 9.03L13.93 8.64L14.33 7.79C14.54 7.32 15.2 7.32 15.42 7.79L15.81 8.65L16.67 9.05C17.13 9.26 17.13 9.92 16.67 10.14L15.8 10.53L15.41 11.39C15.2 11.85 14.53 11.85 14.33 11.39ZM4.61 13.79L5 12.92L5.87 12.53C6.33 12.31 6.33 11.65 5.87 11.43L5 11.05L4.61 10.19C4.4 9.72 3.73 9.72 3.53 10.19L3.13 11.05L2.27 11.45C1.8 11.65 1.8 12.32 2.27 12.53L3.13 12.92L3.53 13.79C3.73 14.25 4.4 14.25 4.61 13.79ZM8.81 8.99L9.39 7.71L10.67 7.13C11.13 6.91 11.13 6.25 10.67 6.03L9.39 5.46L8.81 4.19C8.6 3.72 7.93 3.72 7.73 4.19L7.14 5.46L5.87 6.05C5.4 6.25 5.4 6.92 5.87 7.13L7.14 7.71L7.73 8.99C7.93 9.45 8.6 9.45 8.81 8.99ZM21.99 8.99C21.62 8.65 21.06 8.69 20.72 9.06L14.59 15.96L11.52 12.89C11.05 12.42 10.29 12.42 9.83 12.89L4.11 18.61C3.77 18.96 3.77 19.53 4.11 19.88C4.46 20.23 5.04 20.23 5.39 19.88L10.67 14.59L13.76 17.69C14.25 18.18 15.05 18.15 15.5 17.64L22.07 10.26C22.4 9.89 22.37 9.31 21.99 8.99Z"
                        fillRule="nonzero"
                      />
                    </svg>
                    <span>Панель управления</span>
                  </div>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
