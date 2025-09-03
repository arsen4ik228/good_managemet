import React from 'react'
import classes from './RightSider.module.css'
import avatar from '@image/helper_big_avatar.svg'
import CustomList from '../../../Custom/CustomList/CustomList'
import ListElem from '../../../Custom/CustomList/ListElem'
import stat from '@image/statistic_icon.svg'
import goal from '@image/goal_icon.svg'
import post from '@image/post_icon.svg'
import policy from '@image/poliycy_icon.svg'

export default function RightSider({ postInfo }) {
    const HELPER_SECTIONS = [
        // { id: '9', icon: '', text: 'Схема компании', link: 'companySchema' },
        // { id: '8', icon: '', text: 'Рабочий план', link: 'WorkingPlan' },
        // { id: '2', icon: '', text: 'Проекты', link: 'projectWithProgramm' },
        { id: '7', icon: goal, text: 'Цели', link: 'Goal' },
        { id: '6', icon: policy, text: 'Политика', link: 'Policy' },
        { id: '1', icon: post, text: 'Посты', link: 'Post' },
        // { id: '3', icon: '', text: 'Стратегия', link: 'Strategy' },
        // { id: '4', icon: '', text: 'Краткосрочная цель', link: 'Objective', },
        { id: '5', icon: stat, text: 'Статистики', link: 'Statistics', },
    ]

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.contactInfo}>
                    <div className={classes.avatarSection}>
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className={classes.nameSection}>Гудменеджер</div>
                    {postInfo && (
                        <div className={classes.postSection}>{postInfo}</div>
                    )}
                </div>
                <div className={classes.content}>
                    <CustomList
                        title={'C чем работаем?'}
                    >
                        {HELPER_SECTIONS.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    upperText={item.text}
                                    icon={item.icon}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>
                </div>
            </div>
        </>
    )
}
