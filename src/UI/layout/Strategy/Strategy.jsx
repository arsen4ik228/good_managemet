import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import classes from './Strategy.module.css'

import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { useRightPanel, useModuleActions } from '@hooks';
import { useGetSingleObjective } from '../../../hooks/Objective/useGetSingleObjective';
import { useGetSingleStrategy } from '../../../hooks/Strategy/useGetSingleStrategy';

import org_icon from "@image/org_icon.svg"
import { message, Modal } from "antd";
import { useUpdateSingleStrategy } from '../../../hooks/Strategy/useUpdateSingleStrategy';
import { useAllStrategy } from '../../../hooks/Strategy/useAllStrategy';
import { usePanelPreset } from '../../../hooks';

import { ExclamationCircleFilled } from "@ant-design/icons";

import { useReactToPrint } from 'react-to-print';

import iconSprite from "./img/sprite.svg"

function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function Strategy() {

    const { strategyId } = useParams();
    const { buttonsArr } = useModuleActions("strategy", strategyId);


    const { currentStrategy, refetchStrategy } = useGetSingleStrategy(strategyId);
    const { currentObjective, refetchObjective } = useGetSingleObjective(strategyId);

    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS["STRATEGY"]);

    useEffect(() => {
        const channel = new BroadcastChannel("strategy_channel");

        const handler = (event) => {
            if (event.data === "updated") {
                refetchStrategy();
                refetchObjective();
            }
        };

        channel.addEventListener("message", handler);

        return () => {
            channel.removeEventListener("message", handler);
            channel.close();
        };
    }, [refetchStrategy, refetchObjective]);

    const { updateStrategy } = useUpdateSingleStrategy();
    const { activeStrategyId } = useAllStrategy();

    const updateStrategyHandler = async () => {
        try {
            if (activeStrategyId) {
                Modal.confirm({
                    title: "Есть активная стратегия",
                    icon: <ExclamationCircleFilled />,
                    content: "Чтобы сделать текущую стратегию активной нужно завершить старую.",
                    okText: "Сделать",
                    cancelText: "Не изменять",
                    onOk: () => {
                        // возвращаем Promise
                        return (async () => {
                            await updateStrategy({
                                _id: activeStrategyId,
                                state: "Завершено",
                            }).unwrap();

                            await updateStrategy({
                                _id: strategyId,
                                state: "Активный",
                            }).unwrap();

                            message.success("Стратегия обновлена!");
                        })();
                    }
                });
            } else {
                await updateStrategy({
                    _id: strategyId,
                    state: "Активный",
                }).unwrap();
            }
        } catch (err) {
            message.error("Ошибка!");
        }
    };

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });


    const projects = ["Закупка оборудования", "Установка вентиляции", "Ремонт крыши"];

    const StyleProject = ({ title }) => {
        return (
            <div className={classes.itemProject}>
                <svg viewBox="0 0 24 24" width="24.000000" height="24.000000" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use xlinkHref={`${iconSprite}#${"project"}`}></use>
                </svg>
                <button>{title}</button>
            </div>
        );
    }

    return (
        <MainContentContainer
            buttons={[
                ...(currentStrategy.state !== "Завершено"
                    ? [
                        ...buttonsArr,
                        ...(buttonsArr.length > 0
                            ? currentStrategy.state !== "Активный"
                                ? [{ text: "начать выполнение", color: "#D07400", click: updateStrategyHandler }]
                                : []
                            : [])
                    ]
                    : []),
                { text: "печать", click: reactToPrintFn }
            ]}
        >

            <div ref={contentRef} className={classes.main}>
                <div className={classes.title}>
                    <img src={org_icon} alt="картинка" width={"100px"} height={"100px"} className={classes.image} />
                    <h3 className={classes.h3}>{localStorage.getItem("name")}</h3>
                </div>

                <div className="">
                    <h3 className={classes.h3}>Стратегия №{currentStrategy?.strategyNumber}</h3>
                    <h3 className={classes.date}>
                        {currentStrategy.state === "Черновик"
                            ? null
                            : currentStrategy.state === "Активный"
                                ? `от ${formatDate(currentStrategy.updatedAt)}`
                                : `c ${formatDate(currentStrategy.createdAt)} по ${formatDate(currentStrategy.updatedAt)}`
                        }
                    </h3>
                </div>


                <div>
                    <h4 className={classes.h4}>Ситуация</h4>
                    <p>{currentObjective?.situation}</p>
                </div>


                <div className="">
                    <h4 className={classes.h4}>Причина</h4>
                    <p>{currentObjective?.rootCause}</p>
                </div>


                <div className="">
                    <h4 className={classes.h4}>Краткосрочная цель</h4>

                    <p className={classes.marginLeft}>
                        1. <div>{currentObjective?.content?.[0]}</div>
                    </p>

                    <p className={classes.marginLeft}>
                        2.<div>{currentObjective?.content?.[1]}</div>
                    </p>

                </div>


                <div className="">
                    <h4 className={classes.h4}>Стратегия</h4>
                    <p>{currentStrategy?.content}</p>
                </div>

                <div className="">
                    <h4 className={classes.h4}>Проекты:</h4>
                    <p>Раздел в разработке</p>
                    {/* {
                        projects.map((item) => <StyleProject title={item} />)
                    } */}
                </div>
            </div>

        </MainContentContainer>
    )
}
