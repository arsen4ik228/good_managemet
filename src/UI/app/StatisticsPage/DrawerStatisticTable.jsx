import { useState, useEffect } from "react";
import { Button, Drawer, Flex, message, ConfigProvider } from "antd";

import { useUpdateSingleStatistic } from "@hooks";

import StatisticTable from "./StatisticTable";

export const DrawerStatisticTable = ({
  openDrawer,
  setOpenDrawer,

  dataSource,
  setDataSource,

  createPoints,
  setCreatePoints,

  setDatePoint,

  chartType,

  currentStatistic,

  isLoadingGetStatisticId,
  isFetchingGetStatisticId,

  handleResetTable,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const [createCorellationPoints, setCreateCorellationPoints] = useState([]);

  // Обновление статистики
  const {
    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,
  } = useUpdateSingleStatistic();

  const handleSave = async () => {
    try {
      const DataArray = {
        // Всегда инициализируем как массив, даже если пустой
        statisticDataCreateDtos: [],
        statisticDataUpdateDtos: [],
      };

      // Обработка createCorellationPoints
      if (createCorellationPoints.length > 0) {
        DataArray.statisticDataCreateDtos.push(
          ...createCorellationPoints.map(({ id, ...rest }) => rest)
        );
      }

      // Обработка createPoints
      const arrayNotNullCreatePoints = createPoints.filter(
        (item) => item.value !== null
      );
      if (createPoints.length > 0) {
        DataArray.statisticDataCreateDtos.push(
          ...arrayNotNullCreatePoints.map(({ id, ...rest }) => rest)
        );
      }

      // Обработка обновлений
      DataArray.statisticDataUpdateDtos = dataSource
        .filter((item) => item.isChanged === true)
        .map(({ id, value, correlationType }) => ({
          _id: id,
          value,
          correlationType,
        }));

      // Удаляем пустые массивы
      if (DataArray.statisticDataCreateDtos.length === 0) {
        delete DataArray.statisticDataCreateDtos;
      }
      if (DataArray.statisticDataUpdateDtos.length === 0) {
        delete DataArray.statisticDataUpdateDtos;
      }

      setIsSaving(true);
      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...DataArray,
      }).unwrap();

      message.success("Данные успешно обновлены!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error(
          error?.data?.errors?.[0]?.errors?.[0]
            ? error.data.errors[0].errors[0]
            : error?.data?.message
        );
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setCreateCorellationPoints([]);
      setCreatePoints([]);
      setDataSource((prev) => prev.map(({ isChanged, ...rest }) => rest));
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    handleResetTable();
    setCreateCorellationPoints([]);
  };

  // 1. Первоначальная установка даты при монтировании
  useEffect(() => {
    const calculateInitialDate = () => {
      const currentDate = localStorage.getItem("reportDay");
      if (currentDate !== null) {
        const targetDay = parseInt(currentDate, 10);
        const today = new Date();
        const todayDay = today.getDay();

        let diff = todayDay - targetDay;
        if (diff < 0) diff += 7;

        const lastTargetDate = new Date(today);
        lastTargetDate.setDate(today.getDate() - diff);

        return lastTargetDate.toISOString().split("T")[0];
      }
      return null;
    };

    setDatePoint(calculateInitialDate());
  }, []);

  return (
    <ConfigProvider componentDisabled={!currentStatistic?.isActive}>
      <Drawer
        title="Внести данные"
        placement="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        mask={false}
        width={"27.5vw"}
        style={{
          position: "absolute",
          height: "100%",
        }}
        bodyStyle={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        loading={isFetchingGetStatisticId || isLoadingGetStatisticId}
      >
        <div style={{ padding: "16px", flex: 1, overflow: "auto" }}>
          <StatisticTable
            selectedStatisticId={currentStatistic?.id}
            isActive={currentStatistic?.isActive}
            dataSource={dataSource}
            setDataSource={setDataSource}
            createPoints={createPoints}
            setCreatePoints={setCreatePoints}
            chartType={chartType}
            createCorellationPoints={createCorellationPoints}
            setCreateCorellationPoints={setCreateCorellationPoints}
          ></StatisticTable>
        </div>

        <div style={{ padding: "16px", borderTop: "1px solid #f0f0f0" }}>
          <Flex justify="flex-end" gap="middle">
            <Button
              type="primary"
              onClick={handleSave}
              loading={isSaving}
       
            >
              Сохранить
            </Button>
            <Button
              onClick={handleReset}
            
            >
              Отменить
            </Button>
          </Flex>
        </div>
      </Drawer>
    </ConfigProvider>
  );
};
