// CustomComponent.jsx
import React, { useEffect } from 'react';
import { DatePicker, Input, Select } from 'antd';
import classes from './CustomComponent.module.css';
import { useParams } from 'react-router-dom';
import { loadDraft, saveDraft } from "@helpers/indexedDB";
import { useProjectForm } from '../../../../contexts/ProjectFormContext';

const { Option } = Select;

export const ProjectCreationComponent = () => {

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
                onChange={(e) => setProjectName(e.target.value)}
                />
            </div>

            <div className={classes.selectSection} data-label="Привязать проект">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    value={senderPost}
                    onChange={(value) => setSenderPost(value)}
                >
                    {/* {userPostsInAccount?.map((item, index) => (
                        <Option key={index} value={item.id}>
                            {item.postName}
                        </Option>
                    ))} */}
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