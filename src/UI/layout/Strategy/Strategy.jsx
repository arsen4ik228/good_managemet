import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import classes from './Strategy.module.css'

import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { useRightPanel, useModuleActions } from '@hooks';
import { useGetSingleObjective } from '../../../hooks/Objective/useGetSingleObjective';
import { useGetSingleStrategy } from '../../../hooks/Strategy/useGetSingleStrategy';

import org_icon from "@image/org_icon.svg"
import { message } from "antd";
import { useUpdateSingleStrategy } from '../../../hooks/Strategy/useUpdateSingleStrategy';
import { useAllStrategy } from '../../../hooks/Strategy/useAllStrategy';
import { usePanelPreset } from '../../../hooks';

export function Strategy() {

    const { strategyId } = useParams();
    const { buutonsArr } = useModuleActions("strategy", strategyId);


    const { currentStrategy, refetchStrategy } = useGetSingleStrategy(strategyId)
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
            await updateStrategy({
                _id: activeStrategyId,
                state: "Завершено",
            }).unwrap();

            await updateStrategy({
                _id: strategyId,
                state: "Активный",
            }).unwrap();
            message.success("Стратегия обновлена!");
        } catch (err) {
            message.error("Ошибка!");
        }
    };

    return (
        <MainContentContainer buttons={[...buutonsArr, buutonsArr.length > 0 && {
            text: "начать выполнение",
            click: () => updateStrategyHandler(),
        }]}>
            <div className={classes.main}>


                <div className={classes.title}>
                    <img src={org_icon} alt="картинка" width={"100px"} height={"100px"} className={classes.image} />
                    <h3 className={classes.h3}>{localStorage.getItem("name")}</h3>
                </div>

                <h3 className={classes.h3}>Стратегия №17</h3>

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


                    <h5 className={classes.h5}>из ситуации</h5>
                    <p>{currentObjective?.content?.[0]}</p>

                    <h5 className={classes.h5}>из причины</h5>
                    <p>{currentObjective?.content?.[1]}</p>

                </div>


                <div className="">
                    <h4 className={classes.h4}>Стратегия</h4>
                    <p>{currentStrategy?.content}</p>
                </div>

            </div>
        </MainContentContainer>
    )
}
