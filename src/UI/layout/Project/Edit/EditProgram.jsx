import {useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";
import s from './EditProject.module.css';
import Table from '../components/table/Table';
import {v4 as uuidv4} from 'uuid';
import {useRightPanel, usePanelPreset} from "@hooks";
import {useAllPosts} from '../../../../hooks/Post/useAllPosts';
import {useUpdateSingleProject} from "../../../../hooks/Project/useUpdateSingleProject";
import {message} from 'antd';
import TableInformation from "../components/table/TableInformation";
import debounce from "lodash/debounce";
import {useGetSingleProgram} from "../../../../hooks/Project/useGetSingleProgram";
import {useGetDataForCreateProgram} from "../../../../hooks/Project/useGetDataForCreateProgram";
import TableProgram from "../components/table/TableProgram";
import ModalSelectProject from "../components/modal/ModalSelectProject";

const initialSections = [
    {name: 'Продукт'},
    {name: 'Метрика'},
    {name: 'Организационные мероприятия'},
    {name: 'Правила'},
];

export default function EditProgram({sections, refHandleTargetsInActive, setBtn}) {
    const {PRESETS} = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

    const {programId} = useParams();
    const debouncedSaveRef = useRef(null);
    const prevProjectIdRef = useRef(null);
    const latestStateRef = useRef({});
    const isDirtyRef = useRef(false);

    const [currentProgramId, setCurrentProgramId] = useState();

    const {allPosts} = useAllPosts();
    const {updateProject} = useUpdateSingleProject();
    const {
        currentProgram,
        currentProjects,
        targets,
        statusProgram
    } = useGetSingleProgram({selectedProgramId: currentProgramId});
    const {projects} = useGetDataForCreateProgram();

    const [contentProgram, setContentProgram] = useState("");
    const [projectInProgram, setProjectInProgram] = useState([]);
    const [projectIdsInProgram, setProjectIdsInProgram] = useState([]);
    const [targetsByType, setTargetsByType] = useState({});
    const [focusTargetId, setFocusTargetId] = useState(null);

    const handleUpdateTarget = (type, id, field, value) => {
        isDirtyRef.current = true;
        setTargetsByType(prev => ({
            ...prev,
            [type]: prev[type].map(t => t.id === id
                ?
                {
                    ...t,
                    ...(t.isCreated ? {} : {isChanged: true}),
                    [field]: value
                }
                : t
            ),
        }));
        debouncedSaveRef.current();
    };

    const handleAddTarget = (type) => {
        isDirtyRef.current = true;
        if (type === "Продукт") return
        const newTarget = {
            id: uuidv4(),
            type,
            orderNumber: (targetsByType[type]?.length ?? 0) + 1,
            content: '',
            holderPostId: null,
            deadline: null,
            isCreated: true,
        };
        setTargetsByType(prev => ({
            ...prev,
            [type]: [...prev[type], newTarget],
        }));
        setFocusTargetId(newTarget.id);
    };

    const handleUpdateOrder = (type, newOrderIds) => {
        isDirtyRef.current = true;
        setTargetsByType(prev => ({
            ...prev,
            [type]: newOrderIds.map(id => prev[type].find(t => t.id === id)),
        }));
        debouncedSaveRef.current();
    };

    const handleSave = async () => {
        const {contentProgram, targetsByType, programId, projectIdsInProgram} = latestStateRef.current;
        const productState = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт")?.targetState

        const targetCreateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isCreated && t.content?.trim() !== '')
            .map(({id, isCreated, ...rest}) => rest);

        const targetUpdateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isChanged)
            .map(({id, date, isCreated, isChanged, ...rest}) => ({
                _id: id,
                ...rest
            }));

        console.log("productState = ", productState);
        console.log("targetsByType = ", targetsByType);

        if (productState === "Активная") {
            const holderProductPostId = Object.values(targetsByType)
                .flat()
                .find(t => t.type === "Продукт")?.holderPostId;

            const targetActive = targetCreateDtos.map((t) => ({...t, targetState: "Активная"}));
            const targetUpdate = targetUpdateDtos.filter((t) => t.type === "Черновик" && t.type !== "Продукт")?.map((t) => ({
                ...t,
                targetState: "Активная"
            }));
            try {
                const response = await updateProject({
                    projectId: programId,
                    _id: programId,
                    projectIds: projectIdsInProgram,
                    holderProductPostId,
                    ...(contentProgram?.trim() ? {content: contentProgram} : {content: " "}),
                    ...(targetActive.length > 0 ? {targetCreateDtos: targetActive} : {}),
                    ...(targetUpdate.length > 0 ? {targetUpdateDtos: targetUpdate} : {}),
                }).unwrap();
                message.success("Проект обновлен");
            } catch (error) {
                message.error("Ошибка при обновлении проектов")
            }
        } else {
            try {
                const response = await updateProject({
                    projectId: programId,
                    _id: programId,
                    projectIds: projectIdsInProgram,
                    ...(contentProgram?.trim() ? {content: contentProgram} : {content: " "}),
                    ...(targetCreateDtos.length > 0 ? {targetCreateDtos} : {}),
                    ...(targetUpdateDtos.length > 0 ? {targetUpdateDtos} : {}),
                }).unwrap();
                message.success("Проект обновлен");
            } catch (error) {
                message.error("Ошибка при обновлении проектов")
            }
        }

    };

    const handleTargetsInActive = async () => {
        //targetState(pin):"Активная"
        //targetState(pin):"Завершена"
        const targetCreateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isCreated && t.content.trim() !== '')
            .map(({id, isCreated, ...rest}) => ({...rest, targetState: "Активная"}));

        const targetUpdateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => !t.isCreated)
            .map(({id, date, isCreated, isChanged, ...rest}) => ({
                _id: id,
                ...rest,
                targetState: "Активная"
            }));

        const holderProductPostId = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт")?.holderPostId

        try {
            const response = await updateProject({
                projectId: programId,
                _id: programId,
                projectIds: projectIdsInProgram,
                holderProductPostId,
                ...(contentProgram?.trim() ? {content: contentProgram} : {content: " "}),
                ...(targetCreateDtos.length > 0 ? {targetCreateDtos} : {}),
                ...(targetUpdateDtos.length > 0 ? {targetUpdateDtos} : {}),
            }).unwrap();
            message.success("Проект активный");
        } catch (error) {
            message.error("Ошибка при обновлении проектов")
        }
    };

    refHandleTargetsInActive.current = handleTargetsInActive;

    // для открытия нового проекта и сохранении старого
    useEffect(() => {
        if (!programId) return;

        const prevId = prevProjectIdRef.current;

        if (prevId && prevId !== programId) {

            // 💥 ВАЖНО: отменяем отложённый debounce
            debouncedSaveRef.current?.cancel();

            if (isDirtyRef.current) {
                handleSave(); // сохраняем старый проект
                isDirtyRef.current = false;
            }
        }

        prevProjectIdRef.current = programId;
        setCurrentProgramId(programId);

    }, [programId]);

    // для новых данных в проекте
    useEffect(() => {
        if (!targets) return;

        // 1. Группируем то, что пришло с бэка
        const grouped = targets.reduce((acc, group) => {
            acc[group.title] = group.tasks.map(task => ({
                id: task.id,
                type: group.title,
                orderNumber: task.orderNumber || 1,
                targetState: task.targetState || "Черновик",
                content: task.content || '',
                holderPostId: task.holderPostId || null,
                deadline: task.deadline || null,
                isCreated: false,
            }));
            return acc;
        }, {});

        // 2. Гарантируем наличие всех разделов
        initialSections.forEach(({name}) => {
            if (!grouped[name]) {
                grouped[name] = [
                    {
                        id: uuidv4(),
                        type: name,
                        orderNumber: 1,
                        content: "",
                        targetState: "Черновик",
                        holderPostId: null,
                        deadline: null,
                        isCreated: true,
                    },
                ];
            }
        });

        setContentProgram(currentProgram?.content?.trim());
        setTargetsByType(grouped);
        setProjectInProgram(currentProjects);

        const idsProject = currentProjects.map((p) => p.id);
        setProjectIdsInProgram(idsProject);

        const productState = Object.values(grouped)
            .flat()
            .find(t => t.type === "Продукт")?.targetState

        console.log("productState = ", productState);
        console.log("grouped = ", grouped);

        if (productState === "Черновик") {
            setBtn([
                {
                    text: "начать выполнение",
                    click: () => {
                        refHandleTargetsInActive?.current();
                    },
                },
            ])
        } else {
            setBtn([])
        }
    }, [targets, currentProgram, currentProjects]);

    // заполняется переменная ref latestStateRef для handleSave
    useEffect(() => {
        latestStateRef.current = {
            contentProgram,
            targetsByType,
            programId,
            projectIdsInProgram
        };
    }, [contentProgram, targetsByType, programId, projectIdsInProgram]);

    // создается debounce
    useEffect(() => {
        debouncedSaveRef.current = debounce(handleSave, 25000);

        return () => {
            if (isDirtyRef.current) {
                handleSave(); // сохраняем только если были изменения
            }
            debouncedSaveRef.current?.cancel(); // отменяем таймер
        };
    }, []);

    useEffect(() => {
        if (!debouncedSaveRef.current) return;
        if (!isDirtyRef.current) return;

        debouncedSaveRef.current();
    }, [projectIdsInProgram]);

    console.log("projects = ", projects)
    console.log("currentProjects = ", currentProjects)

    return (
        <div className={s.main}>
            <div className={s.wrapper}>
                {/*<button onClick={handleTargetsInActive}> handleTargetsInActive</button>*/}
                {/*<button onClick={handleSave}> update</button>*/}
                {sections
                    .filter(section => section.isView) // только видимые
                    .map(section => {
                        if (section.name === "Информация") {
                            return (
                                <TableInformation
                                    key={section.name}
                                    title={section.name}
                                    content={contentProgram}
                                    updateContent={(value) => {
                                        isDirtyRef.current = true;
                                        setContentProgram(value)
                                        if (!debouncedSaveRef.current) return;
                                        debouncedSaveRef.current();
                                    }
                                    }
                                />
                            )
                        }

                        if (section.name === "Задача") {
                            return (
                                <>
                                    <TableProgram
                                        key={section.name}
                                        title={section.name}
                                        projects={projectInProgram}
                                        posts={[...allPosts].sort((a, b) => {
                                            const nameA = `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.toLowerCase();
                                            const nameB = `${b.user?.firstName ?? ""} ${b.user?.lastName ?? ""}`.toLowerCase();
                                            return nameA.localeCompare(nameB);
                                        })}
                                        updateTarget={(id, field, value) =>
                                            handleUpdateTarget(section.name, id, field, value)
                                        }
                                        addTarget={() => handleAddTarget(section.name)}
                                        updateOrder={(newProjectsArray) => {
                                            // Здесь newProjectsArray - это уже массив проектов в новом порядке
                                            setProjectInProgram(newProjectsArray);
                                            // Вызываем debounced save если нужно
                                            if (debouncedSaveRef.current) {
                                                debouncedSaveRef.current();
                                            }
                                        }}
                                        setProjectIdsInProgram={setProjectIdsInProgram}

                                        focusTargetId={focusTargetId}
                                    />
                                    <ModalSelectProject
                                        projects={[
                                            ...[...(currentProjects || [])].sort((a, b) =>
                                                a.projectName.localeCompare(b.projectName, "ru")
                                            ),
                                            ...[...(projects || [])].sort((a, b) =>
                                                a.projectName.localeCompare(b.projectName, "ru")
                                            )
                                        ]}
                                        setProjectInProgram={setProjectInProgram}
                                        projectIdsInProgram={projectIdsInProgram}
                                        setProjectIdsInProgram={setProjectIdsInProgram}
                                        isDirtyRef={isDirtyRef}
                                    />

                                </>
                            )
                        }
                        const targets = targetsByType[section.name] || [];
                        return (
                            <Table
                                key={section.name}
                                title={section.name}
                                targets={targets}
                                posts={[...allPosts].sort((a, b) => {
                                    const nameA = `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.toLowerCase();
                                    const nameB = `${b.user?.firstName ?? ""} ${b.user?.lastName ?? ""}`.toLowerCase();
                                    return nameA.localeCompare(nameB);
                                })}
                                updateTarget={(id, field, value) =>
                                    handleUpdateTarget(section.name, id, field, value)
                                }
                                addTarget={() => handleAddTarget(section.name)}
                                updateOrder={(newOrderIds) =>
                                    handleUpdateOrder(section.name, newOrderIds)
                                }
                                focusTargetId={focusTargetId}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
// id(pin):"02e73388-f08a-4bbc-9377-d7a995dd0b9f"
// projectNumber(pin):28
// projectName(pin):"Новый проект №27"