import React from 'react';
import { Input, Select } from 'antd';
import classes from './CustomComponent.module.css';

const { Option } = Select;

export const CustomComponent = () => {
    return (
        <div className={classes.customContainer}>
            <div className={classes.headerSection}>
                Сообщение
            </div>

            <div className={classes.inputSection}>
                <Input
                    placeholder="Введите тему сообщения"
                    className={classes.customInput}
                    bordered={false}
                />
            </div>

            <div className={classes.selectSection} data-label="тип послания">
                <Select
                    placeholder="Выберите опцию 1"
                    className={classes.customSelect}
                    bordered={false}

                >
                    <Option value="option1">Опция 1</Option>
                    <Option value="option2">Опция 2</Option>
                    <Option value="option3">Опция 3</Option>
                </Select>
            </div>

            <div className={classes.selectSection} data-label="мой пост">
                <Select
                    placeholder="Выберите опцию 2"
                    className={classes.customSelect}
                    bordered={false}
                >
                    <Option value="option1">Опция 1</Option>
                    <Option value="option2">Опция 2</Option>
                    <Option value="option3">Опция 3</Option>
                </Select>
            </div>

            <div className={classes.selectSection} data-label="пост получателя">
                <Select
                    placeholder="Выберите опцию 3"
                    className={classes.customSelect}
                    bordered={false}
                >
                    <Option value="option1">Опция 1</Option>
                    <Option value="option2">Опция 2</Option>
                    <Option value="option3">Опция 3</Option>
                </Select>
            </div>
        </div>
    );
};

export default CustomComponent;