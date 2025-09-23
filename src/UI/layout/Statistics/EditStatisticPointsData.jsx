import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { Button, Space, Flex, message, ConfigProvider, Tooltip, Typography, Modal } from "antd";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  ExclamationCircleFilled
} from "@ant-design/icons";

import dayjs from "dayjs";

import EditContainer from "@Custom/EditContainer/EditContainer";

import { useUpdateSingleStatistic, useGetSingleStatistic } from "@hooks";

import StatisticTable from "./StatisticTable";
import { calculateInitialDate, countDays, countWeeks, countMonths, countYears } from "./function/functionForStatistic";
import Graphic from "../../app/Graphic/Graphic";

const { Title } = Typography;

const typeViewStatistic = [
  { value: "thirteen", label: "13 недель" },
  { value: "twenty_six", label: "26 недель" },
  { value: "fifty_two", label: "52 недели" },
  { value: "daily", label: "По дням" },
  { value: "monthly", label: "По месяцам" },
  { value: "yearly", label: "По годам" },
];

const widthMap = {
  fifty_two: {
    height: "calc(100vh - 200px)",
    width: "calc((100vh - 200px)*1.8)",

  },
  twenty_six: {
    height: "calc(100vh - 200px)",
    width: "calc((100vh - 200px)*1.4)",
  },
  default: {
    height: "calc(100vh - 200px)",
    width: "calc((100vh - 200px)/1.4)",
  },
};


export const EditStatisticPointsData = () => {

  const channel = new BroadcastChannel("statistic_channel");

  const { id: statisticId } = useParams();

  const [chartType, setChartType] = useState("thirteen");
  const [datePoint, setDatePoint] = useState(null);

  const [dataSource, setDataSource] = useState([]);
  const [createCorellationPoints, setCreateCorellationPoints] = useState([]);
  const [clickArrow, setClickArrow] = useState([null, null]);

  // Получение статистики по id
  const {
    currentStatistic,
    statisticData,
  } = useGetSingleStatistic({
    statisticId: statisticId,
    datePoint: datePoint,
    viewType: chartType,
  });

  // Обновление статистики
  const {
    updateStatistics,
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
      DataArray.statisticDataCreateDtos = [
        ...DataArray.statisticDataCreateDtos,
        ...dataSource
          .filter((item) => item.isCreate === true && item.value !== null)
          .map(({ value, valueDate }) => ({
            valueDate,
            value
          }))
      ]

      // Обработка обновлений
      DataArray.statisticDataUpdateDtos = dataSource
        .filter((item) => item.isChanged === true && item.isCreate !== true)
        .map(({ id, value, correlationType }) => ({
          _id: id,
          value,
          correlationType,
        }));

      // Удаляем пустые массивы
      if (DataArray.statisticDataCreateDtos.length == 0) {
        delete DataArray.statisticDataCreateDtos;
      }
      if (DataArray.statisticDataUpdateDtos.length == 0) {
        delete DataArray.statisticDataUpdateDtos;
      }

      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...DataArray,
      }).unwrap();

      channel.postMessage("updated");
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
      setDataSource((prev) => prev.map(({ isChanged, ...rest }) => rest));
    }
  };

  const handleResetTable = () => {

    if (chartType === "daily") {
      countDays(datePoint, statisticData, setDataSource);
    }

    if (chartType === "monthly") {
      countMonths(statisticData, setDataSource);
    }

    if (chartType === "yearly") {
      countYears(statisticData, setDataSource);
    }

    if (chartType === "thirteen") {
      countWeeks(13, datePoint, statisticData, setDataSource);
    }
    if (chartType === "twenty_six") {
      countWeeks(26, datePoint, statisticData, setDataSource);
    }
    if (chartType === "fifty_two") {
      countWeeks(52, datePoint, statisticData, setDataSource);
    }
  };

  const handleReset = () => {
    handleResetTable();
    setCreateCorellationPoints([]);
  };

  const exitClick = () => {
    const createDtos = [
      ...createCorellationPoints.map(({ id, ...rest }) => rest)
        .filter((item) => item.value !== null)
        .map(({ id, ...rest }) => rest),

      dataSource
        .filter((item) => item.isCreate === true && item.value !== null)
        .map(({ value, valueDate }) => ({
          valueDate,
          value
        }))
    ];

    const updateDtos = dataSource
      .filter((item) => item.isChanged === true && item.isCreate !== true)
      .map(({ id, value, correlationType }) => ({
        _id: id,
        value,
        correlationType,
      }));


    const hasChanges =
      createDtos.length > 0 ||
      updateDtos.length > 0;


    if (hasChanges) {
      Modal.confirm({
        title: "Есть несохранённые изменения",
        icon: <ExclamationCircleFilled />,
        content:
          "Вы хотите сохранить изменения перед выходом из режима редактирования?",
        okText: "Сохранить",
        cancelText: "Не сохранять",
        onOk() {
          handleSave().then(() => window.close());
        },
        onCancel() {
          window.close();
        },
      });
    } else {
      window.close();
    }
  };

  useEffect(() => {
    setDatePoint(() => {
      return calculateInitialDate(datePoint);
    });
  }, [chartType]);// chartType нужен для того чтобы когда поклацал по стрелкам  и поменял график datePoint сбросилась до клацаний

  useEffect(() => {
    if (!clickArrow[0] || !datePoint) return;

    setDatePoint((prev) => {
      const currentDate = dayjs(prev);
      let newDate;

      switch (chartType) {
        case "daily":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(7, "day")
              : currentDate.subtract(7, "day");
          break;
        case "thirteen":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(7, "day")
              : currentDate.subtract(7, "day");
          break;
        case "twenty_six":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(42, "day")
              : currentDate.subtract(42, "day");
          break;
        case "fifty_two":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(91, "day")
              : currentDate.subtract(91, "day");
          break;
        case "monthly":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(1, "month").date(15)
              : currentDate.subtract(1, "month").date(15);
          break;
        case "yearly":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(1, "year").month(5).date(15)
              : currentDate.subtract(1, "year").month(5).date(15);
          break;
        default:
          return prev;
      }

      return newDate.format("YYYY-MM-DD");
    });
  }, [clickArrow]);

  useEffect(() => {
    if (!statisticId || !datePoint) return;

    const handlers = {
      daily: () => countDays(datePoint, statisticData, setDataSource),
      monthly: () => countMonths(statisticData, setDataSource),
      yearly: () => countYears(statisticData, setDataSource),
      thirteen: () => countWeeks(13, datePoint, statisticData, setDataSource),
      twenty_six: () => countWeeks(26, datePoint, statisticData, setDataSource),
      fifty_two: () => countWeeks(52, datePoint, statisticData, setDataSource),
    };


    const handler = handlers[chartType];
    if (!handler) return;

    handler();
  }, [statisticData, chartType, datePoint]);


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Отслеживаем изменение ширины окна
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <EditContainer header={"ввод данных"} saveClick={handleSave} canselClick={handleReset} exitClick={exitClick}>
      <ConfigProvider componentDisabled={!currentStatistic?.isActive}>
        <div
          style={{
            overflow: "hidden",

            flex: 1,

            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            columnGap: "20px"
          }}>

          <Flex gap={20} style={{
            width: "auto",
            minHeight: "100%",
            backgroundColor: "#fff",
            border: "1px solid #CCCCCC",
            borderRadius: "5px",
            padding: "20px"
          }}
          >

            <StatisticTable
              datePoint={datePoint}
              dataSource={dataSource}
              setDataSource={setDataSource}
              chartType={chartType}
              createCorellationPoints={createCorellationPoints}
              setCreateCorellationPoints={setCreateCorellationPoints}
            ></StatisticTable>

            <div style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
              border: "1px solid #CCCCCC",
              borderRadius: "5px",
              paddingTop: "10px",
              overflow: "hidden"
            }}>
              <Title level={4} style={{ color: "#3E7B94" }}>
                {currentStatistic.name}
              </Title>


              <Graphic
                data={[...dataSource]}
                widthObj={widthMap[chartType] || widthMap.default}
                isSmallPoint={chartType === "fifty_two" && windowWidth < 1900}
                type={currentStatistic?.type}
              />

              <Space
                size="large"
                align="center"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "10px",
                  marginLeft: "50px"
                }}
              >
                <Tooltip title="сдвигает график влево" placement="left">
                  <Button
                    disabled={false}
                    icon={<LeftCircleOutlined />}
                    onClick={() => setClickArrow(["left", new Date()])}
                  />
                </Tooltip>

                <Tooltip title="сдвигает график вправо" placement="right">
                  <Button
                    disabled={false}
                    icon={<RightCircleOutlined />}
                    onClick={() => setClickArrow(["right", new Date()])}
                    style={{
                      marginRight: 50,
                    }}
                  />
                </Tooltip>
              </Space>

            </div>

          </Flex>

          <Flex
            gap="middle"
            vertical
            justify="center"
            align="center"
          >
            {typeViewStatistic.map((item) => (
              <Button
                disabled={false}
                onClick={() => setChartType(item.value)}
                style={{
                  width: "120px",
                  backgroundColor:
                    chartType === item.value ? "rgba(207, 222, 229, 0.5)" : "#fff",
                  color: chartType === item.value ? "#005475" : "#999999",
                  border: "1px solid #CFDEE5",
                  borderRadius: "6px",
                  fontWeight: 400,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Flex>
        </div>
      </ConfigProvider >
    </EditContainer>
  );
};
