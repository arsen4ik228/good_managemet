import React from 'react'
import { useState, useEffect } from "react";
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Graphic from "../../app/Graphic/Graphic";
import useGetReduxOrganization from "../../../hooks/useGetReduxOrganization";
import ReportDay from "./components/ReportDay";
import { useGetSingleStatistic, useRightPanel, usePanelPreset, useModuleActions } from "@hooks";
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
    fifty_two: {
        height: "calc(100vh - 200px)",
        aspectRatio: "297 / 210"

    },
    twenty_six: {
        height: "calc(100vh - 200px)",
        aspectRatio: "297 / 210"

    },
    default: {
        height: "calc(100vh - 200px)",
        aspectRatio: "210 / 297"

    },
};

// const widthMap = {
//     fifty_two: {
//         height: "calc(100vh - 200px)",
//          aspectRatio: "210 / 297"
//         // width: "calc((100vh - 200px)*1.4)",
//     },
//     twenty_six: {
//         height: "calc(100vh - 200px)",
//          aspectRatio: "210 / 297"
//         // width: "calc((100vh - 200px)*1.4)",
//     },
//     default: {
//         height: "calc(100vh - 200px)",
//          aspectRatio: "210 / 297"
//         // width: "calc((100vh - 200px)/1.4)",
//     },
// };


export default function Statistic() {

    const { statisticId } = useParams()

    const { buutonsArr } = useModuleActions("statistic", statisticId);

    const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const [chartType, setChartType] = useState("thirteen");
    const [clickArrow, setClickArrow] = useState([null, null]);

    const [datePoint, setDatePoint] = useState(null);

    const [dataSource, setDataSource] = useState([]);

    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS.STATISTICS);

    // Получение статистики по id
    const {
        currentStatistic,
        statisticData,
        refetch
    } = useGetSingleStatistic({
        statisticId: statisticId,
        datePoint: datePoint,
        viewType: chartType,
    });


    useEffect(() => {
        const channel = new BroadcastChannel("statistic_channel");

        const handler = (event) => {
            if (event.data === "updated") {
                refetch();
            }
        };

        channel.addEventListener("message", handler);

        return () => {
            channel.removeEventListener("message", handler);
            channel.close();
        };
    }, [refetch]);

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

    useEffect(() => {
        setDataSource([]);
    }, [reduxSelectedOrganizationId]);



    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Отслеживаем изменение ширины окна
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                    {statisticId ? (
                        <>

                            <div style={{

                                ...(widthMap[chartType] || widthMap.default),

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
                                <Title level={4} style={{ textAlign: "center", color: "#3E7B94" }}>
                                    {currentStatistic.name}
                                </Title>


                                <div
                                    style={{
                                        width: "100%",

                                        flex: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Graphic
                                        data={[...dataSource]}
                                        widthObj={{ flex: 1, minWidth: "100%", minHeight: "100%" }}
                                        isSmallPoint={chartType === "fifty_two" && windowWidth < 1900}
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
