import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import CustomList from '../../CustomList/CustomList'
import { useCreateProject } from "@hooks/Project/useCreateProject";
import { useAllProject } from "@hooks/Project/useAllProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";


import { AccordionRdx } from "../../../radixUI/accordion/AccordionRdx";
import { TriggerContent } from "../../../layout/Strategy/Split/components/TriggerContent";
import { AccordionContent } from "../../../layout/Strategy/Split/components/AccordionContent";

export default function ProjectsList() {
    const { strategyId } = useParams();

    const {
        projects,
        projectsWithProgram,
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
            await createProject({
                organizationId: reduxSelectedOrganizationId,
                projectName: `Новый проект`,
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
        } catch (error) {
            console.error("Ошибка при создании проекта:", error);
        }
    };


    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()

    const filtredProjects = useMemo(() => {
        if (!seacrhUsersSectionsValue?.trim()) {
            return  [...projectsWithProgram, ...projects]; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhUsersSectionsValue?.toLowerCase();
        return  [...projectsWithProgram, ...projects]?.filter(item =>
            item?.projectName.toLowerCase().includes(searchLower)
        );
    }, [seacrhUsersSectionsValue, projects, projectsWithProgram]);

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
                   filtredProjects?.filter((p) => p?.strategyId === strategyId)?.map((p) => (
                        <AccordionRdx
                            accordionId={p.id}
                            triggerContent={<TriggerContent title={p.projectName} />}
                        >
                            <AccordionContent project={p} updateProject={updateProject} info={p.content} name={p.projectName} product={p?.targets?.find((item) => item.type === "Продукт")?.content} />
                        </AccordionRdx>
                    ))
                }

            </CustomList>
        </>
    )
}
