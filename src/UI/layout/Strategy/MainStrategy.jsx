import { useState } from "react"
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer"

const STATES = {
    VIEW: "view",
    EDIT: "edit",
    SPLIT: "split",
}

export function MainStrategy() {
    const [currentState, setCurrentState] = useState(STATES.VIEW)

    const config = {
        [STATES.VIEW]: {
            btns: [
                { text: "разбить на проекты", click: () => setCurrentState(STATES.SPLIT) },
                { text: "редактирование", click: () => setCurrentState(STATES.EDIT) },
                { text: "начать выполнение", color: "#D07400" },
                { text: "печать" },
            ],
            component: <h1>view</h1>,
        },

        [STATES.EDIT]: {
            btns: [
                { text: "выйти", click: () => setCurrentState(STATES.VIEW) },
                { text: "сохранить" },
            ],
            component: <h1>edit</h1>,
        },

        [STATES.SPLIT]: {
            btns: [
                { text: "выйти", click: () => setCurrentState(STATES.VIEW) },
            ],
            component: <h1>splitToProjects</h1>,
        },
    }

    const { btns, component } = config[currentState]

    return (
        <MainContentContainer buttons={btns}>
            {component}
        </MainContentContainer>
    )
}
