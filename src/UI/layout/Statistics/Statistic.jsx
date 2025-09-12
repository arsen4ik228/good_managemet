import React from 'react'
import { useState, useEffect } from "react";

import classes from "./Statistic.module.css";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Graphic from "../../app/Graphic/Graphic";
import ModalCreateStatistic from "./ModalCreateStatistic";
import useGetReduxOrganization from "../../../hooks/useGetReduxOrganization";
import ReportDay from "./components/ReportDay";
import { useGetSingleStatistic, useRightPanel, usePanelPreset } from "@hooks";
import { calculateInitialDate, countDays, countWeeks, countMonths, countYears } from "./function/functionForStatistic";

import { Button, Space, Tooltip, Flex, Typography } from "antd";
import {
    LeftCircleOutlined,
    RightCircleOutlined,
    SunOutlined,
    MoonOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

import _ from "lodash";
import dayjs from "dayjs";
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const typeViewStatistic = [
    { value: "daily", icon: <SunOutlined />, tooltip: "Ежедневный" },
    { value: "monthly", icon: <MoonOutlined />, tooltip: "Ежемесячный" },
    { value: "yearly", icon: <CalendarOutlined />, tooltip: "Ежегодовой" },
    { value: "thirteen", label: "13", tooltip: "13 недель" },
    { value: "twenty_six", label: "26", tooltip: "26 недель" },
    { value: "fifty_two", label: "52", tooltip: "52 недели" },
];

const widthMap = {
    fifty_two: "100%",
    twenty_six: "70%",
    default: "35%",
};


export default function Statistic() {

    const { statisticId } = useParams()

    const buutonsArr = [
        { text: 'редактировать', click: () => window.open(window.location.origin + '/#/' + 'editStatisticInformation/' + statisticId, '_blank') },
        { text: 'ввести данные', click: () => window.open(window.location.origin + '/#/' + 'editStatisticPointsData/' + statisticId, '_blank') },
    ]

    const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const [chartType, setChartType] = useState("daily");
    const [clickArrow, setClickArrow] = useState([null, null]);

    const [datePoint, setDatePoint] = useState(null);

    const [dataSource, setDataSource] = useState([]);
    const [createPoints, setCreatePoints] = useState([]);

    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS.STATISTICS);

    // Получение статистики по id
    const {
        currentStatistic,
        statisticData,
        isLoadingGetStatisticId,
        isErrorGetStatisticId,
        isFetchingGetStatisticId,
    } = useGetSingleStatistic({
        statisticId: statisticId,

        datePoint: datePoint,

        viewType: chartType,
    });

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
                            ? currentDate.add(1, "day")
                            : currentDate.subtract(1, "day");
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
            daily: () => countDays(datePoint, statisticData, setDataSource, setCreatePoints),
            monthly: () => countMonths(statisticData, setDataSource, setCreatePoints),
            yearly: () => countYears(statisticData, setDataSource, setCreatePoints),
            thirteen: () => countWeeks(13, datePoint, statisticData, setDataSource),
            twenty_six: () => countWeeks(26, datePoint, statisticData, setDataSource),
            fifty_two: () => countWeeks(52, datePoint, statisticData, setDataSource),
        };


        const handler = handlers[chartType];
        if (!handler) return;

        setCreatePoints([]);
        handler();
    }, [statisticData, chartType, datePoint]);

    useEffect(() => {
        setDataSource([]);
        setCreatePoints([]);
    }, [reduxSelectedOrganizationId]);


    return (
        <MainContentContainer
            component={<ReportDay />}
            buttons={buutonsArr}
        >

            <div className={classes.main}>
                <>
                    <HandlerQeury
                        Error={isErrorGetStatisticId}
                        Loading={isLoadingGetStatisticId}
                        Fetching={isFetchingGetStatisticId}
                    ></HandlerQeury>

                    {statisticId ? (
                        <>
                            <Title level={4} style={{ color: "#3E7B94" }}>
                                {currentStatistic.name}
                            </Title>

                            <Flex
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                                gap="small"
                            >
                                {/* График - теперь первый элемент, растягивается на всё оставшееся пространство */}

                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Graphic
                                        data={[...createPoints, ...dataSource]}
                                        width={widthMap[chartType] || widthMap.default}
                                        type={currentStatistic?.type}
                                    />
                                </div>

                                {/* Панель кнопок - сдвигается вправо */}
                                <Flex
                                    gap="middle"
                                    vertical
                                    justify="center"
                                    align="center"
                                    style={{
                                        marginLeft: "auto", // Это сдвигает блок вправо
                                        padding: "0 16px",
                                        borderLeft: "1px solid #f0f0f0", // Визуальное разделение
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    {typeViewStatistic.map((item) => (
                                        <Tooltip
                                            title={item.tooltip}
                                            key={item.value}
                                            placement="left"
                                        >
                                            <Button
                                                type={chartType === item.value ? "primary" : "default"}
                                                onClick={() => setChartType(item.value)}
                                                icon={item?.icon}
                                                style={{
                                                    width: "35px", // Одинаковая ширина для всех кнопок
                                                }}
                                            >
                                                {item?.label}
                                            </Button>
                                        </Tooltip>
                                    ))}
                                </Flex>
                            </Flex>

                            <Space
                                size="large"
                                align="center"
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    marginBottom: "10px"
                                }}
                            >
                                <Tooltip title="сдвигает график влево" placement="left">
                                    <Button
                                        icon={<LeftCircleOutlined />}
                                        onClick={() => setClickArrow(["left", new Date()])}
                                    />
                                </Tooltip>

                                <Tooltip title="сдвигает график вправо" placement="right">
                                    <Button
                                        icon={<RightCircleOutlined />}
                                        onClick={() => setClickArrow(["right", new Date()])}
                                        style={{
                                            marginRight: 50,
                                        }}
                                    />
                                </Tooltip>
                            </Space>

                        </>
                    ) : null}


                </>
            </div>

        </MainContentContainer>
    )
}
