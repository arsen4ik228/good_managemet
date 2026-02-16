import { useState, useRef, useEffect } from "react";
import { Button } from 'antd'
import { useRightPanel, usePanelPreset } from "@hooks";
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer";
import ViewProject from './View/ViewProject.jsx'
import EditProject from "./Edit/EditProject.jsx";
import PopoverForViewSections from "./components/popover/PopoverForViewSections.jsx";
import { useParams } from "react-router-dom";

const STATES = {
    VIEW: "view",
    EDIT: "edit",
};

const initialSections = [
    { name: 'Информация', isView: false },
    { name: 'Продукт', isView: true },
    { name: 'Метрика', isView: false },
    { name: 'Организационные мероприятия', isView: false },
    { name: 'Правила', isView: false },
    { name: 'Задача', isView: true },
];

export default function ProjectPage() {
    const refHandleTargetsInActive = useRef({});
    const [currentState, setCurrentState] = useState(STATES.VIEW);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [sections, setSections] = useState(initialSections);
    const { projectId } = useParams()

    const toggleSection = (name) => {
        setSections(prev =>
            prev.map(section =>
                section.name === name
                    ? { ...section, isView: !section.isView }
                    : section
            )
        );
    };

    const [btn, setBtn] = useState([]);

    const config = {
        [STATES.VIEW]: {
            btns: [
                {
                    text: "редактировать",
                    click: () => {
                        setCurrentState(STATES.EDIT)
                    },
                },
            ],
            component: <ViewProject />,
        },

        [STATES.EDIT]: {
            btns: [
                {
                    text: "выйти",
                    click: () => {
                        setCurrentState(STATES.VIEW)
                    },
                },
                ...btn,
                // {
                //     text: "начать выполнение",
                //     click: () => {
                //         refHandleTargetsInActive?.current();
                //     },
                // },
            ],
            popover: (
                <PopoverForViewSections
                    sections={sections}
                    onToggle={toggleSection}
                    isOpen={popoverVisible}
                    onClose={() => setPopoverVisible(false)}
                >
                    <Button onClick={() => setPopoverVisible(true)}>
                        отобразить разделы
                    </Button>
                </PopoverForViewSections>
            ),
            component: (
                <EditProject
                    sections={sections}
                    refHandleTargetsInActive={refHandleTargetsInActive}
                    setBtn={setBtn}
                />
            ),
        },
    };

    const { btns, component, popover } = config[currentState];

    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

    useEffect(() => {
        if(projectId)
            setCurrentState(STATES.VIEW)
    }, [projectId])

    return (
        <MainContentContainer buttons={btns} popoverButton={popover}>
            {component}
        </MainContentContainer>
    );
}