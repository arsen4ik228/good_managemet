import React, { useState, useEffect } from "react";
import classes from "./ModalSetting.module.css";
import exitModal from "@image/exitModal.svg";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
import TableCheckBox from "@Custom/tableCheckBox/TableCheckBox";
import { useAllStatistics } from "@hooks/Statistics/useAllStatistics";
import { Input, Select, Typography } from "antd";

const panelTypes = [
  { value: "Личная", label: "Личная" },
  { value: "Глобальная", label: "Глобальная" },
];

export default function ModalSetting({
  exit,
  currentControlPanel,
  updateControlPanel,
  statisticsIdsInPanel,
}) {
  const [oldPanelName, setOldPanelName] = useState("");
  const [panelName, setPanelName] = useState("");
  const [panelType, setPanelType] = useState("");
  const [statisticsChecked, setStatisticsChecked] = useState([]);

  const {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  } = useAllStatistics({
    statisticData: false,
  });

  const saveUpdateControlPanel = async () => {
    const Data = {};

    // Data.statisticIds = statisticsChecked;

    if (oldPanelName !== panelName) {
      Data.panelName = panelName;
    }
    if (currentControlPanel.panelType !== panelType) {
      Data.panelType = panelType;
    }
    await updateControlPanel({
      ...Data,
      id: currentControlPanel.id,
    })
      .unwrap()
      .then(() => {
        exit();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const handleChecboxChange = (id) => {
    setStatisticsChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (currentControlPanel) {
      setPanelName(
        currentControlPanel.isNameChanged
          ? currentControlPanel.panelName
          : `${currentControlPanel.panelName} ${currentControlPanel.controlPanelNumber}`
      );
      setOldPanelName(
        currentControlPanel.isNameChanged
          ? currentControlPanel.panelName
          : `${currentControlPanel.panelName} ${currentControlPanel.controlPanelNumber}`
      );
      setPanelType(currentControlPanel.panelType);
    }
    if (statisticsIdsInPanel) {
      setStatisticsChecked(statisticsIdsInPanel);
    }
  }, [currentControlPanel, statisticsIdsInPanel]);

  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitModal"
          onClick={exit}
          className={classes.exit}
        />
        <div className={classes.wrapper}>
          <div className={classes.header}>
            <div className={classes.save}>
              <ButtonImage
                name={"сохранить"}
                icon={Blacksavetmp}
                onClick={saveUpdateControlPanel}
              ></ButtonImage>
            </div>

            <Typography>Название панели </Typography>
            <Input
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
              size="small"
            ></Input>
            <Typography>Тип панели </Typography>
            <Select
              value={panelType}
             onChange={(value) => setPanelType(value)}
              options={panelTypes}
              size="small"
            ></Select>
          </div>

          <TableCheckBox
            nameTable={"Прикрепленные статистики"}
            array={statistics}
            arrayItem={"name"}
            arrayCheked={statisticsChecked}
            handleChecboxChange={handleChecboxChange}
          ></TableCheckBox>
        </div>
      </div>
    </div>
  );
}
