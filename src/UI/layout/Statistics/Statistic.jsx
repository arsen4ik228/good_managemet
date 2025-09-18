import React from 'react'
import { useState, useEffect } from "react";

import classes from "./Statistic.module.css";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Graphic from "../../app/Graphic/Graphic";
import useGetReduxOrganization from "../../../hooks/useGetReduxOrganization";
import ReportDay from "./components/ReportDay";
import { useGetSingleStatistic, useRightPanel, usePanelPreset } from "@hooks";
import { calculateInitialDate, countDays, countWeeks, countMonths, countYears } from "./function/functionForStatistic";

import { Button, Space, Tooltip, Flex, Typography } from "antd";
import {
    LeftCircleOutlined,
    RightCircleOutlined,
} from "@ant-design/icons";

import _ from "lodash";
import dayjs from "dayjs";
import { useParams } from 'react-router-dom';
import { homeUrl } from '@helpers/constants'


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
    fifty_two: "55vw",
    twenty_six: "50vw",
    default: "20vw",
};


export default function Statistic() {

    const { statisticId } = useParams()

    const buutonsArr = [
        { text: 'редактировать', click: () => window.open(homeUrl + '#/' + 'editStatisticInformation/' + statisticId, '_blank') },
        { text: 'ввести данные', click: () => window.open(homeUrl + '#/' + 'editStatisticPointsData/' + statisticId, '_blank') },
    ]

    const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const [chartType, setChartType] = useState("daily");
    const [clickArrow, setClickArrow] = useState([null, null]);

    const [datePoint, setDatePoint] = useState(null);

    const [dataSource, setDataSource] = useState([]);

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

    useEffect(() => {
        setDataSource([]);

    }, [reduxSelectedOrganizationId]);


    return (
        <MainContentContainer
            component={<ReportDay />}
            buttons={buutonsArr}
        >

            <div style={{
                overflow: "hidden",

                flex: 1,

                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                columnGap: "20px",

                padding: "10px",
            }}>
                <>
                    <HandlerQeury
                        Error={isErrorGetStatisticId}
                        Loading={isLoadingGetStatisticId}
                        Fetching={isFetchingGetStatisticId}
                    ></HandlerQeury>

                    {statisticId ? (
                        <>

                            <div style={{
                                minHeight: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                border: "1px solid #CCCCCC",
                                borderRadius: "5px",
                                padding: "10px 5px 0px 5px",
                                overflow: "hidden",
                            }}>
                                <Title level={4} style={{ color: "#3E7B94" }}>
                                    {currentStatistic.name}
                                </Title>


                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Graphic
                                        data={[...dataSource]}
                                        width={widthMap[chartType] || widthMap.default}
                                        type={currentStatistic?.type}
                                    />
                                </div>


                                <Space
                                    size="large"
                                    align="center"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        marginBottom: "10px",
                                        marginLeft: "50px",
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

                            </div>

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
                        </>
                    ) : null}

                </>
            </div>

        </MainContentContainer >
    )
}
