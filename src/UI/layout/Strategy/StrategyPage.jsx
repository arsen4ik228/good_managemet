import { useState } from "react"
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer"
import { usePrint } from "../../../helpers/printHook/usePrint";
import { ViewStrategy } from "./View/ViewStrategy";
import useViewStrategy from "./View/useViewStrategy";
import useEditStrategy from "./Edit/useEditStrategy";
import { EditStrategy } from "./Edit/EditStrategy";
import useSplitStrategy from "./Split/useSplitStrategy";
import SplitStrategy from "./Split/SplitStrategy";
import { useRightPanel, usePanelPreset } from '@hooks';

const STATES = {
    VIEW: "view",
    EDIT: "edit",
    SPLIT: "split",
}

export function StrategyPage() {

    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS["STRATEGY"]);

    const [currentState, setCurrentState] = useState(STATES.VIEW);

    const { contentRef, reactToPrintFn } = usePrint();
    const { updateStrategyHandler } = useViewStrategy();
    const { ...propsEditStartegy } = useEditStrategy();
    const { ...propsSplitStrategy } = useSplitStrategy();

    const config = {
        [STATES.VIEW]: {
            btns: [
                { text: "разбить на проекты", click: () => setCurrentState(STATES.SPLIT) },
                { text: "редактирование", click: () => setCurrentState(STATES.EDIT) },
                { text: "начать выполнение", color: "#D07400", click: updateStrategyHandler },
                { text: "печать", click: reactToPrintFn },
            ],
            component: <ViewStrategy contentRef={contentRef} />,
        },

        [STATES.EDIT]: {
            btns: [
                {
                    text: "выйти", click: () => {
                        propsEditStartegy.exitClick();
                        setCurrentState(STATES.VIEW)
                    }
                },
                { text: "сохранить", click: propsEditStartegy.handleSave },
            ],
            component: <EditStrategy {...propsEditStartegy} />,
        },

        [STATES.SPLIT]: {
            btns: [
                { text: "выйти", click: () => setCurrentState(STATES.VIEW) },
            ],
            component: <SplitStrategy {...propsSplitStrategy}></SplitStrategy>,
        },
    }

    const { btns, component } = config[currentState]

    return (
        <MainContentContainer buttons={btns}>
            {component}
        </MainContentContainer>
    )
}
