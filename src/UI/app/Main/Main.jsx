import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Main.module.css";
import { useOrganizationHook, useConvertsHook } from "@hooks";
import NavigationBar from "@Custom/NavigationBar/NavigationBar";
import Header from "@Custom/CustomHeader/Header";
import { useDispatch } from "react-redux";
import { setSelectedOrganizationId, setSelectedOrganizationReportDay, setSelectedItem } from "@slices";
import { DialogContainer } from "@Custom/DialogContainer/DialogContainer";
import { useSocket } from "@helpers/SocketContext.js"; // Импортируем useSocket

const MobileMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState();

  const { organizations } = useOrganizationHook();

  const { allConverts, refetchGetConverts } = useConvertsHook()
  console.log(allConverts)

  const eventNames = useMemo(() => ['convertCreationEvent', 'messageCountEvent'], []); // Мемоизация массива событий

  const handleEventData = useCallback((eventName, data) => {
    console.log(`Data from ${eventName}:`, data);
  }, []); // Мемоизация callback

  const socketResponse = useSocket(eventNames, handleEventData);
  // console.log(socketResponse)

  const selectOrganization = (id, reportDay) => {
    if (typeof window !== "undefined" && window.localStorage) {
      let savedId = window.localStorage.getItem("selectedOrganizationId");

      if (savedId && savedId === id.toString()) return setSelectedOrg(id);

      window.localStorage.setItem("selectedOrganizationId", id.toString());
    }
    console.log('bam-bam')
    setSelectedOrg(id)
    localStorage.setItem("reportDay", reportDay);
    dispatch(setSelectedOrganizationId(id));
    dispatch(setSelectedOrganizationReportDay(reportDay));
  };

  const getStylesLine = useMemo(
    () => (id) => {
      if (id === selectedOrg) {
        return {
          borderBottom: "1px solid #005475",
        };
      }
    },
    [selectedOrg]
  );

  const getStylesName = useMemo(
    () => (id) => {
      if (id === selectedOrg) {
        return {
          color: "#005475",
        };
      }
    },
    [selectedOrg]
  );

  const handleControlPanelButtonClick = () => {
    navigate("/ControlPanel");
  };

  const handleButtonClick = () => {
    navigate("/pomoshnik/user");
  };

  const handleItemClick = (item) => {
    //dispatch(setSelectedItem(item));

    navigate(`/Chat/${item.userIds}`)
  } 

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrg)
      selectOrganization(organizations[0]?.id);
  }, [organizations]);

  useEffect(() => {
    refetchGetConverts()
  }, [socketResponse])

  return (
    <div className={classes.wrapper}>
      <>
        <Header offLeftIcon={true}>Good Management</Header>
      </>
      <div className={classes.body}>
        <div className={classes.bodyColumn}>
          {organizations?.map((item, index) => (
            <>
              <div
                key={index}
                className={classes.orgElement}
                onClick={() => selectOrganization(item?.id, item?.reportDay)}
                style={getStylesName(item.id)}
              >
                <span className={classes.bodyElementText}>
                  {item.organizationName}
                </span>
              </div>

              {selectedOrg === item.id && (
                <div
                  className={classes.controlPanel}
                  style={getStylesLine(item.id)}
                  onClick={handleControlPanelButtonClick}
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M14.33 11.39L13.93 10.52L13.07 10.13C12.6 9.91 12.6 9.25 13.07 9.03L13.93 8.64L14.33 7.79C14.54 7.32 15.2 7.32 15.42 7.79L15.81 8.65L16.67 9.05C17.13 9.26 17.13 9.92 16.67 10.14L15.8 10.53L15.41 11.39C15.2 11.85 14.53 11.85 14.33 11.39ZM4.61 13.79L5 12.92L5.87 12.53C6.33 12.31 6.33 11.65 5.87 11.43L5 11.05L4.61 10.19C4.4 9.72 3.73 9.72 3.53 10.19L3.13 11.05L2.27 11.45C1.8 11.65 1.8 12.32 2.27 12.53L3.13 12.92L3.53 13.79C3.73 14.25 4.4 14.25 4.61 13.79ZM8.81 8.99L9.39 7.71L10.67 7.13C11.13 6.91 11.13 6.25 10.67 6.03L9.39 5.46L8.81 4.19C8.6 3.72 7.93 3.72 7.73 4.19L7.14 5.46L5.87 6.05C5.4 6.25 5.4 6.92 5.87 7.13L7.14 7.71L7.73 8.99C7.93 9.45 8.6 9.45 8.81 8.99ZM21.99 8.99C21.62 8.65 21.06 8.69 20.72 9.06L14.59 15.96L11.52 12.89C11.05 12.42 10.29 12.42 9.83 12.89L4.11 18.61C3.77 18.96 3.77 19.53 4.11 19.88C4.46 20.23 5.04 20.23 5.39 19.88L10.67 14.59L13.76 17.69C14.25 18.18 15.05 18.15 15.5 17.64L22.07 10.26C22.4 9.89 22.37 9.31 21.99 8.99Z"
                      fill-rule="nonzero"
                    />
                  </svg>
                  <span>Панель управления</span>
                </div>
              )}
            </>
          ))}

          <button onClick={handleButtonClick} className={classes.btnAddUser}> Добавить пользователя </button>

          {allConverts?.map((item, index) => (
            <div onClick={() => handleItemClick(item)}>
             <React.Fragment  key={index} >
              <DialogContainer elem={item}></DialogContainer>
             </React.Fragment>
            </div>
          ))}
        </div>
      </div>
      <footer className={classes.footer}>

        <NavigationBar></NavigationBar>

      </footer>
    </div >
  );
};

export default MobileMain;
