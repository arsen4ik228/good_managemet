import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import s from './EditProject.module.css';
import Table from '../components/table/Table';
import {v4 as uuidv4} from 'uuid';
import {useRightPanel, usePanelPreset} from "@hooks";
import {useAllPosts} from '../../../../hooks/Post/useAllPosts';
import {useGetSingleProject} from "../../../../hooks/Project/useGetSingleProject";
import {useUpdateSingleProject} from "../../../../hooks/Project/useUpdateSingleProject";
import {message} from 'antd';
import TableInformation from "../components/table/TableInformation";
import debounce from "lodash/debounce";

const project = {
    projectName: 'projectName',
    targets: [
        {id: uuidv4(), type: 'Продукт', orderNumber: 1, content: 'Продукт', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Задачи', orderNumber: 1, content: 'Задача 1', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Задачи', orderNumber: 2, content: 'Задача 2', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Показатели', orderNumber: 1, content: 'Показатели 1', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Показатели', orderNumber: 2, content: 'Показатели 2', holderPostId: null, date: null},
        {
            id: uuidv4(),
            type: 'Правила и ограничения',
            orderNumber: 1,
            content: 'Правила и ограничения 1',
            holderPostId: null,
            date: null
        },
        {
            id: uuidv4(),
            type: 'Организационные мероприятия',
            orderNumber: 1,
            content: 'Организационные мероприятия 1',
            holderPostId: null,
            date: null
        },
    ],
};

const initialSections = [
    {name: 'Продукт'},
    {name: 'Метрика'},
    {name: 'Организационные мероприятия'},
    {name: 'Правила'},
    {name: 'Задача'},
];

export default function EditProject({sections, refHandleTargetsInActive,refHandleStateProductInCompleted, setBtn, openView}) {
    const {PRESETS} = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

    const {projectId} = useParams();
    const debouncedSaveRef = useRef(null);
    const prevProjectIdRef = useRef(null);
    const latestStateRef = useRef({});
    const isDirtyRef = useRef(false);

    const [currentProjectId, setCurrentProjectId] = useState();

    const {allPosts} = useAllPosts();
    const {updateProject} = useUpdateSingleProject();
    const {currentProject, targets} = useGetSingleProject({selectedProjectId: currentProjectId});

    const [contentProject, setContentProject] = useState("");
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
        const {contentProject, targetsByType, projectId} = latestStateRef.current;
        const productState = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт")?.targetState

        const targetCreateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isCreated && t.content.trim() !== '')
            .map(({id, isCreated, ...rest}) => rest);

        const targetUpdateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isChanged)
            .map(({id, date, isCreated, isChanged, ...rest}) => ({
                _id: id,
                ...rest
            }));

        console.log("targetUpdateDtos = ", targetUpdateDtos);


        if (productState === "Активная") {
            const holderProductPostId = Object.values(targetsByType)
                .flat()
                .find(t => t.type === "Продукт")?.holderPostId;

            const targetCreate = targetCreateDtos.map((t) => ({...t, targetState: "Активная"}));
            const targetUpdateDraft = targetUpdateDtos.filter((t) => t.type === "Черновик" && t.type !== "Продукт")?.map((t) => ({
                ...t,
                targetState: "Активная"
            }));
            const targetUpdateActive = targetUpdateDtos.filter((t) => t.type === "Черновик" && t.type !== "Продукт")?.map((t) => ({
                ...t,
                targetState: "Активная"
            }));

            const targetUpdate = [...targetUpdateDraft, ...targetUpdateActive];
            console.log("targetUpdate = ", targetUpdate);
            try {
                const response = await updateProject({
                    projectId: projectId,
                    _id: projectId,
                    holderProductPostId,
                    ...(contentProject?.trim() ? {content: contentProject} : {content: " "}),
                    ...(targetCreate.length > 0 ? {targetCreateDtos: targetCreate} : {}),
                    ...(targetUpdate.length > 0 ? {targetUpdateDtos: targetUpdate} : {}),
                }).unwrap();
                message.success("Проект обновлен");
            } catch (error) {
                message.error("Ошибка при обновлении проектов")
            }
        } else {
            try {
                const response = await updateProject({
                    projectId: projectId,
                    _id: projectId,
                    ...(contentProject?.trim() ? {content: contentProject} : {content: " "}),
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
                projectId: projectId,
                _id: projectId,
                holderProductPostId,
                ...(contentProject?.trim() ? {content: contentProject} : {content: " "}),
                ...(targetCreateDtos.length > 0 ? {targetCreateDtos} : {}),
                ...(targetUpdateDtos.length > 0 ? {targetUpdateDtos} : {}),
            }).unwrap();
            message.success("Проект активный");
        } catch (error) {
            message.error("Ошибка при обновлении проектов")
        }
    };

    refHandleTargetsInActive.current = handleTargetsInActive;

    const handleStateProductInCompleted = async () => {
        const target = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт");

        const targetUpdateDtos = target
            ? (() => {
                const { id, isCreated, ...rest } = target;

                return [{
                    _id: id,
                    ...rest,
                    targetState: "Завершена"
                }];
            })()
            : [];

        const holderProductPostId = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт")?.holderPostId

        try {
            const response = await updateProject({
                projectId: projectId,
                _id: projectId,
                holderProductPostId,
                ...(contentProject?.trim() ? {content: contentProject} : {content: " "}),
                ...(targetUpdateDtos.length > 0 ? {targetUpdateDtos} : {}),
            }).unwrap();
            openView();
            message.success("Проект завершен");
        } catch (error) {
            message.error("Ошибка при обновлении проектов")
        }
    };

    refHandleStateProductInCompleted.current = handleStateProductInCompleted;

    // для открытия нового проекта и сохранении старого
    useEffect(() => {
        if (!projectId) return;

        const prevId = prevProjectIdRef.current;

        if (prevId && prevId !== projectId) {

            // 💥 ВАЖНО: отменяем отложённый debounce
            debouncedSaveRef.current?.cancel();

            if (isDirtyRef.current) {
                handleSave(); // сохраняем старый проект
                isDirtyRef.current = false;
            }
        }

        prevProjectIdRef.current = projectId;
        setCurrentProjectId(projectId);

    }, [projectId]);

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
                        content: '',
                        targetState: "Черновик",
                        holderPostId: null,
                        deadline: null,
                        isCreated: true,
                    },
                ];
            }
        });

        setContentProject(currentProject?.content?.trim());
        setTargetsByType(grouped);

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
        } else if(productState === "Активная"){
            setBtn([
                {
                    text: "завершить проект",
                    click: () => {
                        refHandleStateProductInCompleted?.current();
                    },
                },
            ])
        }else{
            setBtn([])
        }
    }, [targets, currentProject]);

    // заполняется переменная ref latestStateRef для handleSave
    useEffect(() => {
        latestStateRef.current = {
            contentProject,
            targetsByType,
            projectId,
        };
    }, [contentProject, targetsByType, projectId]);

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
                                    content={contentProject}
                                    updateContent={(value) => {
                                        isDirtyRef.current = true;
                                        setContentProject(value)
                                        if (!debouncedSaveRef.current) return;
                                        debouncedSaveRef.current();
                                    }
                                    }
                                />
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
