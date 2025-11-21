// CustomComponent.jsx
import React, { useEffect } from 'react';
import { DatePicker, Input, Select } from 'antd';
import classes from './CustomComponent.module.css';
import { useParams } from 'react-router-dom';
import { loadDraft, saveDraft } from "@helpers/indexedDB";
import { useWorkingPlanForm } from '../../../../contexts/WorkingPlanContext';

const { Option } = Select;

export const WorkingPlanCreationComponent = () => {

    const {
        dateStart,
        setDateStart,
        deadline,
        setDeadline,
        senderPost,
        setSenderPost,
        userPostsInAccount,
    } = useWorkingPlanForm();


    return (
        <div className={classes.customContainer}>
            <div className={classes.headerSection}>
                Задача
            </div>

            <div className={classes.selectSection} data-label="дата начала">
                <DatePicker
                    value={dateStart}
                    onChange={(e) => setDateStart(e)}
                    format="DD.MM.YYYY"
                    style={{
                        width: "100%",
                        backgroundColor: "#F0F0F0",
                        border: 'none',
                        height: '50px',
                        boxShadow: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                    // Дополнительные пропсы для отключения эффектов
                    allowClear={false}
                    // suffixIcon={null} 
                    onFocus={(e) => {
                        e.target.blur(); // Убираем фокус
                    }}
                />
            </div>

            <div className={classes.selectSection} data-label="дата завершения">
                <DatePicker
                    value={deadline}
                    onChange={(e) => setDeadline(e)}
                    format="DD.MM.YYYY"
                    style={{
                        width: "100%",
                        backgroundColor: "#F0F0F0",
                        border: 'none',
                        height: '50px',
                        boxShadow: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                    // Дополнительные пропсы для отключения эффектов
                    allowClear={false}
                    // suffixIcon={null} 
                    onFocus={(e) => {
                        e.target.blur(); // Убираем фокус
                    }}
                />
            </div>

            <div className={classes.selectSection} data-label="мой пост">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    value={senderPost}
                    onChange={(value) => setSenderPost(value)}
                >
                    {userPostsInAccount?.map((item, index) => (
                        <Option key={index} value={item.id}>
                            {item.postName}
                        </Option>
                    ))}
                </Select>
            </div>

        </div>
    );
};

export default WorkingPlanCreationComponent;