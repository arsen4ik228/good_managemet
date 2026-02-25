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
    const refHandleTargetsInActive = useRef({});
    const [currentState, setCurrentState] = useState(STATES.VIEW);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [sections, setSections] = useState(initialSections);

    const {projectId} = useParams()
    const {programId} = useParams()

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

    const config = {
        [STATES.VIEW]: {
            ...(projectId ? {
                btns: [
                    {
                        text: "редактировать",
                        click: () => {
                            setCurrentState(STATES.EDIT)
                        },
                    },
                    {
                        text: "печать",
                        click: reactToPrintFn,
                    },
                ],
                component: <ViewProject contentRef={contentRef}/>,
            } : {
                btns: [
                    {
                        text: "редактировать программу",
                        click: () => {
                            setCurrentState(STATES.EDIT)
                        },
                    },
                    {
                        text: "печать",
                        click: reactToPrintFn,
                    },
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
                        setBtn={setBtn}
                    />
                ),
            } : {
                btns: [
                    {
                        text: "выйти из программ",
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
                        setBtn={setBtn}
                    />
                ),
            })

        },
    };

    const {btns, component, popover} = config[currentState];

    const {PRESETS} = useRightPanel();

    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

    useEffect(() => {
        if (projectId)
            setCurrentState(STATES.VIEW)
    }, [projectId])

    useEffect(() => {
        if (programId)
            setCurrentState(STATES.VIEW)
    }, [programId])

    const {currentProject, statusProject} = useGetSingleProject({selectedProjectId: projectId});
    const {
        currentProgram,
        currentProjects,
        targets,
        statusProgram
    } = useGetSingleProgram({selectedProgramId: programId});

    let arrayNameForView = [];

    if (projectId) {
        arrayNameForView = currentState === STATES.EDIT ? [
            {label: "Проект: ", value: currentProject?.projectName},
            {label: "Статус: ", value: statusProject}
        ] : [];
    }

    if (programId) {
        arrayNameForView = currentState === STATES.EDIT ? [
            {label: "Программа: ", value: currentProgram?.projectName},
            {label: "Статус: ", value: statusProgram}
        ] : [];
    }

    return (
        <MainContentContainer buttons={btns} popoverButton={popover} arrayName={arrayNameForView}>
            {component}
        </MainContentContainer>
    );
}