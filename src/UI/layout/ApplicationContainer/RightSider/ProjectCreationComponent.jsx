// CustomComponent.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { DatePicker, Input, message, Select } from 'antd';
import classes from './CustomComponent.module.css';
import { useParams } from 'react-router-dom';
import { loadDraft, saveDraft } from "@helpers/indexedDB";
import { useProjectForm } from '../../../../contexts/ProjectFormContext';
import { useUpdateSingleProject } from '../../../../hooks/Project/useUpdateSingleProject';
import debounce from 'lodash/debounce';

const { Option } = Select;

export const ProjectCreationComponent = () => {

    const { updateProject } = useUpdateSingleProject();
    const { projectId } = useParams();

    const {
        dateStart,
        setDateStart,
        deadline,
        setDeadline,
        senderPost,
        setSenderPost,
        userPostsInAccount,
        projectName,
        setProjectName
    } = useProjectForm();

    // Создаем ref для хранения актуального projectName
    const projectNameRef = useRef(projectName);
    
    // Обновляем ref при изменении projectName
    useEffect(() => {
        projectNameRef.current = projectName;
    }, [projectName]);

    // Debounced функция для обновления проекта
    const debouncedUpdateProjectName = useCallback(
        debounce(async () => {
            try {
                const response = await updateProject({
                    projectId: projectId,
                    _id: projectId,
                    projectName: projectNameRef.current
                }).unwrap();
                message.success("Проект обновлен");
            } catch (error) {
                message.error("Ошибка при обновлении проектов");
            }
        }, 1300), // Задержка 1 секунда
        [projectId, updateProject]
    );

    // Обработчик изменения имени
    const handleProjectNameChange = (e) => {
        const newValue = e.target.value;
        setProjectName(newValue);
        debouncedUpdateProjectName();
    };

    // Отмена debounced вызова при размонтировании
    useEffect(() => {
        return () => {
            debouncedUpdateProjectName.cancel();
        };
    }, [debouncedUpdateProjectName]);



    return (
        <div className={classes.customContainer}>
            <div className={classes.headerSection}>
                Проект
            </div>

            <div className={classes.selectSection} data-label="Название проекта">
                <Input
                    placeholder="Введите название проекта"
                    className={classes.customInput}
                    bordered={false}
                    value={projectName}
                    onChange={handleProjectNameChange}
                />
            </div>

            <div className={classes.selectSection} data-label="Привязать проект">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    value={senderPost}
                    onChange={(value) => setSenderPost(value)}
                    disabled
                >
                    <Option value={1}>
                        Черновик стратегии
                    </Option>
                    <Option value={2}>
                        Текущая стратегия
                    </Option>
                </Select>
            </div>

        </div>
    );
};

export default ProjectCreationComponent;