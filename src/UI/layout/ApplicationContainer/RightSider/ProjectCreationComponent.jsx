// CustomComponent.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { DatePicker, Input, message, Select } from 'antd';
import classes from './CustomComponent.module.css';
import { useParams } from 'react-router-dom';
import { loadDraft, saveDraft } from "@helpers/indexedDB";
import { useProjectForm } from '../../../../contexts/ProjectFormContext';
import { useUpdateSingleProject } from '../../../../hooks/Project/useUpdateSingleProject';
import debounce from 'lodash/debounce';
import { useStrategyHook } from '../../../../hooks/useStrategyHook';

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
        setProjectName,

        setStrategyId,
        strategyId
    } = useProjectForm();

    // Создаем ref для хранения актуального projectName
    const projectNameRef = useRef(projectName);
    const strategyIdRef = useRef(strategyId)
    const isProjectDataChanged = useRef(false)

    const { activeAndDraftStrategies } = useStrategyHook()

    // Обновляем ref при изменении projectName
    useEffect(() => {
        projectNameRef.current = projectName;
    }, [projectName]);
    useEffect(() => {
        strategyIdRef.current = strategyId;
    }, [strategyId]);

    // Создаем функцию для немедленного сохранения (чтобы не дублировать код)
    const saveProjectNameImmediately = useCallback(async () => {
        // Проверяем, что имя действительно менялось
        if (!isProjectDataChanged.current) return;

        try {
            const response = await updateProject({
                projectId: projectId,
                _id: projectId,
                projectName: projectNameRef.current,
                strategyId: strategyIdRef.current,
            }).unwrap();
            message.success("Проект обновлен");
            // Сбрасываем флаг после успешного сохранения
            isProjectDataChanged.current = false;
        } catch (error) {
            message.error("Ошибка при обновлении проектов");
        }
    }, [projectId, updateProject]);

    // Debounced функция для обновления проекта
    const debouncedUpdateProjectName = useCallback(
        debounce(async () => {
            await saveProjectNameImmediately();
        }, 1300), // Задержка 5 секунд (у тебя в комменте было 1s, но в коде 5000)
        [saveProjectNameImmediately]
    );

    // Обработчик изменения имени
    const handleProjectNameChange = (e) => {
        const newValue = e.target.value;
        setProjectName(newValue);
        isProjectDataChanged.current = true
        debouncedUpdateProjectName();
    };

    const habdleChangeStrategyId = (e) => {
        // const newValue = e;
        setStrategyId(e);
        isProjectDataChanged.current = true
        debouncedUpdateProjectName();
    }

    // Отмена debounced вызова и немедленное сохранение при размонтировании
    useEffect(() => {
        return () => {
            // Отменяем запланированный debounced вызов
            debouncedUpdateProjectName.cancel();

            // Если имя менялось - сохраняем немедленно
            if (isProjectDataChanged.current) {
                saveProjectNameImmediately();
            }
        };
    }, [debouncedUpdateProjectName, saveProjectNameImmediately]);

    console.log(activeAndDraftStrategies)

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

            <div className={classes.selectSection} data-label="Прикрепить стратегию">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    value={strategyId}
                    onChange={habdleChangeStrategyId}
                >
                    {(activeAndDraftStrategies[0] && activeAndDraftStrategies[0].state === 'Черновик') && (
                        <Option value={activeAndDraftStrategies[0]?.id}>
                            Черновик стратегии
                        </Option>
                    )}
                    {((activeAndDraftStrategies[0] && activeAndDraftStrategies[0].state === 'Активный') ||
                        (activeAndDraftStrategies[1] && activeAndDraftStrategies[1].state === 'Активный')) && (
                            <Option value={activeAndDraftStrategies[1]?.id}>
                                Текущая стратегия
                            </Option>
                        )}
                    <Option value={null}>
                        Отсутствует
                    </Option>

                </Select>
            </div>

        </div>
    );
};

export default ProjectCreationComponent;