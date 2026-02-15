import React, {useEffect, useMemo, useRef, useState} from 'react'
import { useNavigate, useParams} from 'react-router-dom';
import CustomList from '../../CustomList/CustomList'
import { useCreateProject } from "@hooks/Project/useCreateProject";
import { useAllProject } from "@hooks/Project/useAllProject";
import active_project from '@image/active_project.svg';
import program_icon from '@image/program_icon.svg';
import ListElem from '../../CustomList/ListElem';

export default function ProjectsAndProgramsList() {

    const navigate = useNavigate()
    const { projectId } = useParams();
    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()
    const [openedAccordionId, setOpenedAccordionId] = useState(null);
    const accordionRefs = useRef({});
    const {
        projects,
        archivesProjects,
        projectsWithProgram,
        archivesProjectsWithProgram,

        programs,
        archivesPrograms,

        maxProjectNumber
    } = useAllProject();

    const {
        reduxSelectedOrganizationId,
        createProject,
    } = useCreateProject();

    const createNewProject = async () => {
        try {
            // Сохраняем результат запроса в переменную
            const result = await createProject({
                organizationId: reduxSelectedOrganizationId,
                projectName: `Новый проект №${maxProjectNumber + 1}`,
                type: "Проект",
                content: " ",
                targetCreateDtos: [
                    {
                        type: "Продукт",
                        orderNumber: 1,
                        content: " ",
                    },
                ],
            }).unwrap();
            setOpenedAccordionId(result?.id);
            // Проверяем структуру ответа
            console.log('Result от сервера:', result);

            // Получаем ID из результата (зависит от структуры ответа сервера)
            const projectId = result.id || result._id || result.data?.id;

            if (projectId) {
                // Навигация с ID созданного проекта
                navigate(`helper/project/${projectId}`);
            } else {
                console.error('ID проекта не найден в ответе сервера:', result);
                // Альтернативная навигация или сообщение об ошибке
                navigate('helper/projects');
            }

        } catch (error) {
            console.error("Ошибка при создании проекта:", error);
        }
    };

    const openProject = (id) => {
        navigate(`helper/project/${id}`)
    }

    const filtredProjects = useMemo(() => {
        const combined = [...projectsWithProgram, ...projects, ...programs];

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

    // для автоскролла до выбранного элемента при перезагрузки страницы
    useEffect(() => {
        if (projectId) {
            setOpenedAccordionId(projectId);
        }
    }, [projectId]);

    // console.log(projectsWithProgram, '   ', projects, '    ', programs)

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
                                ref={el => {
                                    if (el) accordionRefs.current[item.id] = el;
                                }}
                            />
                        </React.Fragment>
                    ))
                }

            </CustomList>
        </>
    )
}
