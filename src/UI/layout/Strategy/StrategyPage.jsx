import { useState, useMemo } from "react";
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer";
import { usePrint } from "../../../helpers/printHook/usePrint";
import { ViewStrategy } from "./View/ViewStrategy";
import useViewStrategy from "./View/useViewStrategy";
import useEditStrategy from "./Edit/useEditStrategy";
import { EditStrategy } from "./Edit/EditStrategy";
import useSplitStrategy from "./Split/useSplitStrategy";
import SplitStrategy from "./Split/SplitStrategy";
import { useRightPanel, usePanelPreset } from "@hooks";

const STATES = {
    VIEW: "view",
    EDIT: "edit",
    SPLIT: "split",
};

const STRATEGY_STATE_MAP = {
    "Черновик": "draft",
    "Активный": "edit",
    "Завершено": "completed",
};

export function StrategyPage() {
    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS["STRATEGY"]);

    const [currentState, setCurrentState] = useState(STATES.VIEW);

    const { contentRef, reactToPrintFn } = usePrint();
    const { currentStrategy, updateStrategyHandler } = useViewStrategy();
    const propsEditStrategy = useEditStrategy();
    const propsSplitStrategy = useSplitStrategy();

    const strategyStateKey = useMemo(() => {
        return STRATEGY_STATE_MAP[currentStrategy?.state] ?? "draft";
    }, [currentStrategy?.state]);

    const viewButtonsByStrategyState = {
        draft: [
            { text: "разбить на проекты", click: () => setCurrentState(STATES.SPLIT) },
            { text: "редактирование", click: () => setCurrentState(STATES.EDIT) },
            {
                text: "начать выполнение",
                color: "#D07400",
                click: updateStrategyHandler,
            },
            { text: "печать", click: reactToPrintFn },
        ],
        edit: [
            { text: "разбить на проекты", click: () => setCurrentState(STATES.SPLIT) },
            { text: "редактирование", click: () => setCurrentState(STATES.EDIT) },
            { text: "печать", click: reactToPrintFn },
        ],
        completed: [
            { text: "печать", click: reactToPrintFn },
        ],
    };

    const config = {
        [STATES.VIEW]: {
            btns: viewButtonsByStrategyState[strategyStateKey],
            component: <ViewStrategy contentRef={contentRef} />,
        },

        [STATES.EDIT]: {
            btns: [
                {
                    text: "выйти",
                    click: () => {
                        propsEditStrategy.exitClick();
                        setCurrentState(STATES.VIEW);
                    },
                },
                { text: "сохранить", click: propsEditStrategy.handleSave },
            ],
            component: <EditStrategy {...propsEditStrategy} />,
        },

        [STATES.SPLIT]: {
            btns: [
                { text: "выйти", click: () => setCurrentState(STATES.VIEW) },
            ],
            component: <SplitStrategy {...propsSplitStrategy} />,
        },
    };

    const { btns, component } = config[currentState];

    return (
        <MainContentContainer buttons={btns}>
            {component}
        </MainContentContainer>
    );
}
