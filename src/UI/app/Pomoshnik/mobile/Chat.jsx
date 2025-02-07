import React, { useEffect, useMemo, useState } from 'react';
import classes from './Chat.module.css';
import backRow from './icon/icon _ back.svg'
import star from './icon/icon _ star.svg'
import stats from './icon/_icon _ stats.svg'
import listView from './icon/icon _ list view.svg'
import post from './icon/icon _ post.svg'
import strategy from './icon/icon _ strategy.svg'
import policy from './icon/icon _policy.svg'
import avatar from '../Custom/icon/messendger _ avatar.svg'
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Custom/CustomHeader/Header';
import { useOrganizationHook } from '@hooks';
import { notEmpty } from '@helpers/helpers';

const Chat = () => {

    const array = [
        { id: '1', icon: post, text: 'Посты', link: 'Posts' },
        { id: '2', icon: listView, text: 'Проекты', link: 'Projects' },
        { id: '3', icon: strategy, text: 'Стратегия', link: 'Strategy' },
        { id: '4', icon: star, text: 'Краткосрочная цель', link: 'Objective', },
        { id: '5', icon: stats, text: 'Статистики', link: 'Statistics', },
        { id: '6', icon: policy, text: 'Политика', link: 'Policy' },
        { id: '7', icon: star, text: 'Цели', link: 'Goal' },
        { id: '8', icon: star, text: 'Рабочий план', link: 'WorkingPlan' },
    ]

    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrg, setSelectedOrg] = useState()

    const {
        organizations = []
    } = useOrganizationHook()

    const selectOrganization = (id) => {
        setSelectedOrg(id);
        if (typeof window !== 'undefined' && window.localStorage) {
            let savedId = window.localStorage.getItem('selectedOrganizationId');

            if (savedId && savedId === id.toString()) return

            window.localStorage.setItem('selectedOrganizationId', id.toString());
        }
    }

    // const filteredArray = useMemo(() => {
    //     return array.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
    // }, [array, searchTerm]);
    const filteredArray = useMemo(() =>
        array.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm]
    );

    useEffect(() => {

        if (!notEmpty(organizations)) return

        const saveId = window.localStorage.getItem('selectedOrganizationId')

        if (saveId) 
            return setSelectedOrg(saveId)
        
        setSelectedOrg(organizations[0].id)

        // if (typeof window !== 'undefined' && window.localStorage) {
        //     let savedId = window.localStorage.getItem('selectedOrganizationId');

        //     if (savedId && savedId === id.toString()) return

        //     window.localStorage.setItem('selectedOrganizationId', id.toString());
        // }
    }, [organizations])


    return (

        <>
            <div className={classes.wrapper}>
                <>
                    <Header>Личный помощник</Header>
                </>
                <div className={classes.body}>


                    <div className={classes.bodyColumn}>
                        {filteredArray.map((item) => {
                            return (
                                <div key={item.id} className={classes.bodyRow}>
                                    <div
                                        className={classes.bodyElement}
                                        onClick={() => navigate(`/Chat/${item.link}`)}
                                    >
                                        <img src={item.icon} alt="icon" />
                                        <div className={classes.bodyElementText}>{item.text}</div>
                                    </div>
                                </div>
                            );

                        })}
                    </div>
                        <div className={classes.questionContainer}>
                            <div className={classes.questionBody}>
                                <div className={classes.imgContainer}>
                                    <img src={avatar} alt="" />
                                </div>
                                <div className={classes.textContainer}>
                                    <span>С чем будем работать в</span>
                                    <span>
                                    <select name="oragnization" value={selectedOrg} onChange={(e) => selectOrganization(e.target.value)}>
                                        {organizations.map((item, index) => (
                                            <option key={index} value={item.id}>{item.organizationName}</option>
                                        ))}
                                    </select>
                                    
                                    ?</span>
                                </div>
                            </div>
                        </div>

                </div>
                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow}>
                        <div className={classes.inputElement}>
                            <input type="search"
                                placeholder="Поиск"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Chat;