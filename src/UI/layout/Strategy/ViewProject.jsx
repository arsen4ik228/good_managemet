import React from 'react'
import classes from "./ViewProject.module.css"


import TextArea from 'antd/es/input/TextArea';
import { Button as ButtonAntDesign } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import iconSprite from "./img/sprite.svg"

import bigProject from "./img/bigProject.svg"
import bigProgramm from "./img/bigProgramm.svg"

import add from '@image/big_plus.svg'

const Header = ({ title }) => {
    return (
        <div className={classes.header}>
            {title}
        </div>
    )
}


const CreateProject = ({ title }) => {
    return (
        <button className={classes.buttonCreate}>
            <img src={add} alt={add} />
            {title}
        </button>
    )
}


const ListItem = ({ title, subtitle, src }) => {
    return (
        <div className={classes.listItem}>
            <img src={src} alt={src} />
            <div className={classes.wrapperName}>
                <span className={classes.subtitle}> {subtitle} </span>
                {title}
            </div>
            <ButtonAntDesign type="text" icon={<DeleteOutlined />} />
        </div>
    )
}


const Icon = ({iconId}) => {
    return (
        <svg viewBox="0 0 24 24" width="24.000000" height="24.000000" fill="none"  xmlns="http://www.w3.org/2000/svg">
            <use xlinkHref={`${iconSprite}#${iconId}`}></use>
        </svg>
    );
};


const Button = ({ title, iconId }) => {
    return (
        <div className={classes.buttonPrj}>
            <Icon iconId={iconId}/>
            {title}
        </div>
    )
}


const FieldSet = ({ title, description, rows }) => {
    return (
        <fieldset className={classes.fieldset}>
            <legend className={classes.legend}> {title} </legend>
            <TextArea
                style={{
                    resize: "none",
                    border: "none",
                }}
                autoSize={{ minRows: rows, maxRows: rows }}
                value={description}
            ></TextArea>
        </fieldset>
    )
}


const array = [
    {
        src: bigProgramm,
        title: "Установка вентиляции",
        subtitle: "Программа из стратегии",
    },
    {
        src: bigProject,
        title: "Проект из стратегии",
        subtitle: "Закупка оборудования",
    },
    {
        src: bigProject,
        title: "Проект из стратегии",
        subtitle: "Установка вентиляции",
    },
    {
        src: bigProject,
        title: "Проект",
        subtitle: "Повышение продаж",
    },
    {
        src: bigProject,
        title: "Мой проект",
        subtitle: "Уборка склада №2",
    },
    {
        src: bigProject,
        title: "Проект из стратегии",
        subtitle: "Установка вентиляции",
    },
    {
        src: bigProject,
        title: "Проект",
        subtitle: "Повышение продаж",
    },
    {
        src: bigProject,
        title: "Мой проект",
        subtitle: "Уборка склада №2",
    },
]

export default function ViewProject() {
    return (
        <div className={classes.main}>

            <div className={classes.modulePrjWithPrgm}>
                <Header title={"Проекты и программы"} />
                <CreateProject title={"Создать проект или программу"} />

                <div className={classes.listItemWrapper}>
                    {
                        array.map((item) => <ListItem src={item.src} title={item.title} subtitle={item.subtitle} />)
                    }
                </div>
            </div>

            <div className={classes.modulePrj}>
                <Header title={"Проект"} />
                <div className={classes.btnWrapper}>
                    <Button title={"Проект"} iconId={"project"} />
                    <Button title={"Программа"} iconId={"programm"} />
                </div>
                <FieldSet title={"информация по проекту"} rows={4} description={"Решение: Подключить такие устройства на кухне, в гостиной, офисе на пилоты (сетевые фильтры) и полностью выключать пилоты, когда техника не используется (особенно на ночь и при длительном отсутствии)."} />
                <FieldSet title={"название проекта"} rows={2} description={"Уборка склада №2"} />
                <FieldSet title={"продукт проекта"} rows={2} description={"Чистый склад, без мусора, плесени и грязи, пригодный для работы."} />
            </div>

        </div>
    )
}
