import React, {useMemo, useState, useRef, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import CustomList from '../../CustomList/CustomList'
import {useCreateProject} from "@hooks/Project/useCreateProject";
import {useAllProject} from "@hooks/Project/useAllProject";
import {useUpdateSingleProject} from "@hooks/Project/useUpdateSingleProject";


import {AccordionRdx} from "../../../radixUI/accordion/AccordionRdx";
import {TriggerContent} from "../../../layout/Strategy/Split/components/TriggerContent";
import {AccordionContent} from "../../../layout/Strategy/Split/components/AccordionContent";

export default function ProjectsList() {
    const {strategyId} = useParams();
    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()
    const [openedAccordionId, setOpenedAccordionId] = useState(null);
    const accordionRefs = useRef({});

    const {
        projects,
        projectsWithProgram,
        maxProjectNumber
    } = useAllProject();

    const {
        reduxSelectedOrganizationId,
        createProject,
    } = useCreateProject();

    const {
        updateProject,
    } = useUpdateSingleProject();

    const createNewProject = async () => {
        try {
            const response = await createProject({
                organizationId: reduxSelectedOrganizationId,
                projectName: `Новый проект №${maxProjectNumber + 1}`,
                type: "Проект",
                strategyId: strategyId,
                content: " ",
                targetCreateDtos: [
                    {
                        type: "Продукт",
                        orderNumber: 1,
                        content: " ",
                    },
                ],
            }).unwrap();
            setOpenedAccordionId(response?.id);
        } catch (error) {
            console.error("Ошибка при создании проекта:", error);
        }
    };

    const filtredProjects = useMemo(() => {
        const combined = [...projectsWithProgram, ...projects].filter((p) => p?.strategyId === strategyId);
        console.log("combined", combined);
        const filtered = seacrhUsersSectionsValue?.trim()
            ? combined.filter(item =>
                item.projectName.toLowerCase().includes(seacrhUsersSectionsValue.toLowerCase())
            )
            : combined;

        // Сортировка по projectName
        return filtered?.sort((a, b) => a.projectName.localeCompare(b.projectName));
    }, [seacrhUsersSectionsValue, projects, projectsWithProgram]);

    useEffect(() => {
        if (!openedAccordionId) return;

        requestAnimationFrame(() => {
            accordionRefs.current[openedAccordionId]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }, [openedAccordionId, filtredProjects]);

    return (
        <>
            <CustomList
                title={'Проекты'}
                searchValue={seacrhUsersSectionsValue}
                searchFunc={setSeacrhUsersSectionsValue}
                addButtonClick={() => createNewProject()}
                addButtonText={'Создать проект'}
            >
                {
                    filtredProjects?.map((p) => (
                        <AccordionRdx
                            accordionId={p.id}
                            isOpen={openedAccordionId === p.id}
                            onToggle={(val) => {
                                setOpenedAccordionId(val); // val либо id, либо null
                            }}
                            ref={el => {
                                if (el) accordionRefs.current[p.id] = el;
                            }}
                            triggerContent={<TriggerContent title={p.projectName}/>}
                        >
                            <AccordionContent project={p} updateProject={updateProject} info={p.content}
                                              name={p.projectName}
                                              product={p?.targets?.find((item) => item.type === "Продукт")?.content}
                                              onSaved={() => setOpenedAccordionId(p.id)}/>
                        </AccordionRdx>
                    ))
                }

            </CustomList>
        </>
    )
}
