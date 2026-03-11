import {useState, useRef, useEffect} from "react";
import {Button} from 'antd'
import {useRightPanel, usePanelPreset} from "@hooks";
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer";
import ViewProject from './View/ViewProject.jsx'
import EditProject from "./Edit/EditProject.jsx";
import PopoverForViewSections from "./components/popover/PopoverForViewSections.jsx";
import {useParams} from "react-router-dom";
import {useGetSingleProject} from "../../../hooks/Project/useGetSingleProject";
import {usePrint} from "../../../helpers/printHook/usePrint";
import {useGetSingleProgram} from "../../../hooks/Project/useGetSingleProgram";
import ViewProgram from "./View/ViewProgram";
import EditProgram from "./Edit/EditProgram";

const STATES = {
    VIEW: "view",
    EDIT: "edit",
};

const initialSections = [
    {name: 'Информация', isView: false},
    {name: 'Продукт', isView: true},
    {name: 'Метрика', isView: false},
    {name: 'Организационные мероприятия', isView: false},
    {name: 'Правила', isView: false},
    {name: 'Задача', isView: true},
];

export default function ProjectPage() {
    const {PRESETS} = useRightPanel();

    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

    const refHandleTargetsInActive = useRef({});
    const refHandleStateProductInCompleted = useRef({});
    const [currentState, setCurrentState] = useState(STATES.VIEW);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [sections, setSections] = useState(initialSections);

    const {projectId, programId} = useParams()

    const toggleSection = (name) => {
        setSections(prev =>
            prev.map(section =>
                section.name === name
                    ? {...section, isView: !section.isView}
                    : section
            )
        );
    };

    const [btn, setBtn] = useState([]);

    const {contentRef, reactToPrintFn} = usePrint();

    const {currentProject, statusProject} = useGetSingleProject({selectedProjectId: projectId});
    const {
        currentProgram,
        statusProgram
    } = useGetSingleProgram({selectedProgramId: programId});

    const config = {
        [STATES.VIEW]: {
            ...(projectId ? {
                btns: [
                    {
                        text: "печать",
                        click: reactToPrintFn,
                    },
                    ...(statusProject === "Завершена"
                        ? []
                        : [{
                            text: "редактировать",
                            click: () => setCurrentState(STATES.EDIT),
                        }])
                ],
                component: <ViewProject contentRef={contentRef}/>,
            } : {
                btns: [
                    {
                        text: "печать",
                        click: reactToPrintFn,
                    },
                    ...(statusProgram === "Завершена"
                        ? []
                        : [{
                            text: "редактировать",
                            click: () => setCurrentState(STATES.EDIT),
                        }])
                ],
                component: <ViewProgram contentRef={contentRef}/>,
            })

        },

        [STATES.EDIT]: {

            ...(projectId ? {
                btns: [
                    {
                        text: "выйти",
                        click: () => {
                            setCurrentState(STATES.VIEW)
                        },
                    },
                    ...btn,
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
                        refHandleStateProductInCompleted={refHandleStateProductInCompleted}
                        setBtn={setBtn}
                        openView={() => setCurrentState(STATES.VIEW)}
                    />
                ),
            } : {
                btns: [
                    {
                        text: "выйти",
                        click: () => {
                            setCurrentState(STATES.VIEW)
                        },
                    },
                    ...btn,
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
                    <EditProgram
                        sections={sections}
                        refHandleTargetsInActive={refHandleTargetsInActive}
                        refHandleStateProductInCompleted={refHandleStateProductInCompleted}
                        setBtn={setBtn}
                        openView={() => setCurrentState(STATES.VIEW)}
                    />
                ),
            })

        },
    };

    const {btns, component, popover} = config[currentState];

    useEffect(() => {
        if (projectId || programId) {
            setCurrentState(STATES.VIEW);
        }
    }, [projectId, programId]);

    let arrayNameForView = [];

    if (currentState === STATES.EDIT) {
        if (projectId) {
            arrayNameForView = [
                {label: "Проект: ", value: currentProject?.projectName},
                {label: "Статус: ", value: statusProject},
            ];
        }

        if (programId) {
            arrayNameForView = [
                {label: "Программа: ", value: currentProgram?.projectName},
                {label: "Статус: ", value: statusProgram},
            ];
        }
    }

    return (
        <MainContentContainer buttons={btns} popoverButton={popover} arrayName={arrayNameForView}>
            {component}
        </MainContentContainer>
    );
}