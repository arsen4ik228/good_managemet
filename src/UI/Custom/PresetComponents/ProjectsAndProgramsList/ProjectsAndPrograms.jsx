import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CustomList from '../../CustomList/CustomList'
import { useCreateProject } from "@hooks/Project/useCreateProject";
import { useAllProject } from "@hooks/Project/useAllProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";
import active_project from '@image/active_project.svg';
import program_icon from '@image/program_icon.svg';

import { AccordionRdx } from "../../../radixUI/accordion/AccordionRdx";
import { TriggerContent } from "../../../layout/Strategy/Split/components/TriggerContent";
import { AccordionContent } from "../../../layout/Strategy/Split/components/AccordionContent";
import ListElem from '../../CustomList/ListElem';

export default function ProjectsAndProgramsList() {
    const { strategyId } = useParams();
    const navigate = useNavigate()


    const {
        projects,
        archivesProjects,
        projectsWithProgram,
        archivesProjectsWithProgram,

        programs,
        archivesPrograms,
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
                projectName: `Новый проект _ тестовый`,
                type: "Проект",
                // strategyId: strategyId,
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

    const openProject = (id) => {
        navigate(`helper/project/${id}`)
    }

    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()

    const filtredProjects = useMemo(() => {
        if (!seacrhUsersSectionsValue?.trim()) {
            return [...projectsWithProgram, ...projects, ...programs]; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhUsersSectionsValue?.toLowerCase();
        return [...projectsWithProgram, ...projects, ...programs]?.filter(item =>
            item?.projectName.toLowerCase().includes(searchLower)
        );
    }, [seacrhUsersSectionsValue, projects, projectsWithProgram, programs]);

    console.log(projectsWithProgram, '   ', projects, '    ', programs)

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
                    filtredProjects?.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListElem
                                icon={item.type === 'Программа' ? program_icon : active_project}
                                upperText={item.projectName}
                                linkSegment={item.id}
                                clickFunc={() => openProject(item.id)}
                                // bage={item.targets.length}
                                upperLabel={item.type === 'Программа' ? 'Программа из стратегии' : 'Проект'}
                            />
                        </React.Fragment>
                    ))
                }

            </CustomList>
        </>
    )
}
