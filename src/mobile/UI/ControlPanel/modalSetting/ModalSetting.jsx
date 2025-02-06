import React, { useState, useEffect } from "react";
import classes from "./ModalSetting.module.css";
import Input from "@Custom/Input/Input";
import Select from "@Custom/Select/Select";
import TableCheckBox from "@Custom/tableCheckBox/TableCheckBox";
import { useStatisticsHook } from "@hooks";
import ModalContainer from "../../Custom/ModalContainer/ModalContainer";

export default function ModalSetting({
  exit,
  currentControlPanel,
  updateControlPanel,
  statisticsIdsInPanel,
}) {
  const panelTypes = [
    { id: "Личная", type: "Личная" },
    { id: "Глобальная", type: "Глобальная" },
  ];

  const graphicTypes = [
    { id: "Ежедневный", value: "Ежедневный", view: "Ежедневный" },
    { id: "Ежемесячный", value: "Ежемесячный", view: "Ежемесячный" },
    { id: "Ежегодовой", value: "Ежегодовой", view: "Ежегодовой" },
    { id: "13", value: "13", view: "13 недель" },
    { id: "26", value: "26", view: "26 недель" },
    { id: "52", value: "52", view: "52 недели" },
  ];

  const [oldPanelName, setOldPanelName] = useState("");
  const [panelName, setPanelName] = useState("");
  const [panelType, setPanelType] = useState("");
  const [graphType, setGraphType] = useState("");
  const [statisticsChecked, setStatisticsChecked] = useState([]);

  const {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  } = useStatisticsHook({ statisticData: false });

  const saveUpdateControlPanel = async () => {
    const Data = {};

    Data.statisticIds = statisticsChecked;

    if (oldPanelName !== panelName) {
      Data.panelName = panelName;
    }
    if (currentControlPanel.panelType !== panelType) {
      Data.panelType = panelType;
    }
    if (currentControlPanel.graphType !== graphType) {
      Data.graphType = graphType;
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
      setGraphType(currentControlPanel.graphType);
    }
    if (statisticsIdsInPanel) {
      setStatisticsChecked(statisticsIdsInPanel);
    }
  }, [currentControlPanel, statisticsIdsInPanel]);

  return (
    <ModalContainer clickFunction={saveUpdateControlPanel} setOpenModal={exit}>
      <div className={classes.header}>
        <Input
          name={"Название панели"}
          value={`${panelName}`}
          onChange={setPanelName}
        ></Input>
        <div className={classes.blockSelect}>
          <Select
            name={"Тип панели"}
            value={panelType}
            onChange={setPanelType}
            array={panelTypes}
            arrayItem={"type"}
          ></Select>
          <Select
            name={"Тип графиков"}
            value={graphType}
            onChange={setGraphType}
            array={graphicTypes}
            arrayItem={"view"}
          ></Select>
        </div>
      </div>

      <TableCheckBox
        name={"Прикрепленные статистики"}
        array={statistics}
        arrayCheked={statisticsChecked}
        handleChecboxChange={handleChecboxChange}
      ></TableCheckBox>
    </ModalContainer>
  );
}
