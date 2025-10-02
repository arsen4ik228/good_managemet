import React, { useEffect, useMemo, useState } from 'react';
import classes from './RightSider.module.css';
import avatar from '@image/helper_big_avatar.svg';
import CustomList from '../../../Custom/CustomList/CustomList';
import ListElem from '../../../Custom/CustomList/ListElem';
import stat from '@image/statistic_icon.svg';
import goal from '@image/goal_icon.svg';
import post from '@image/post_icon.svg';
import policy from '@image/poliycy_icon.svg';
import controlPanel_icon from '@image/controlPanel_icon.svg'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RightPanelMapper from '@helpers/RightPanelMapper';
import CustomComponent from './CustomComponent';
import { homeUrl } from '@helpers/constants'


import schemaCompany from '@image/schemaCompany.svg';
import project from '@image/project.svg';
import strategy from '@image/strategy.svg';
import workingPlan from '@image/strategy.svg';
import { useGetReduxOrganization } from '../../../../hooks';

export default function RightSider({ config : initialConfig }) {    //
    const { convertId, contactId } = useParams()
    const location = useLocation()
    const navigate = useNavigate();
    const [searchHelperSectionsValue, setSearchHelperSectionsValue] = useState('');
    const [selectedItemHelper, setSelectedItemHelper] = useState()
    const [expanendHelper, setExpanendHelper] = useState(true)

    const { reduxSelectedOrganizationName } = useGetReduxOrganization()

    // Мемоизируем config, чтобы он не пересоздавался при каждом рендере
    const config = useMemo(() => initialConfig, [
        initialConfig.componentType,
        initialConfig.props?.avatar,
        initialConfig.props?.name,
        initialConfig.props?.postsNames
    ]);

    const HELPER_SECTIONS = [
        { id: '7', icon: goal, text: 'Цели', link: 'goal' },
        { id: '6', icon: policy, text: 'Политика', link: 'policy' },
        { id: '1', icon: post, text: 'Посты', link: 'posts' },
        { id: '5', icon: stat, text: 'Статистики', link: 'statistics' },
        { id: '2', icon: controlPanel_icon, text: 'Панель управления', link: 'controlPanel' },
        { id: '3', icon: stat, text: 'Сводка', link: 'svodka' },

        { id: '8', icon: strategy, text: 'Стратегия', link: 'strategy', isActive: false },
        { id: '9', icon: project, text: 'Проекты', link: 'project', isActive: false },
        { id: '10', icon: schemaCompany, text: 'Схема компании', link: 'schemaCompany', isActive: false },
        { id: '10', icon: workingPlan, text: 'Рабочий план', link: 'WorkingPlan', isActive: false },
    ];

    const handlerClickHelper = (link) => {
        if (link === 'controlPanel' || link === 'svodka') {
            window.open(homeUrl + `#/${link}`, '_blank')
        }
        else
            navigate(`helper/${link}`);
    };

    const filtredHelperSections = useMemo(() => {
        if (!searchHelperSectionsValue.trim()) {
            return HELPER_SECTIONS;
        }

        const searchLower = searchHelperSectionsValue.toLowerCase();
        return HELPER_SECTIONS.filter(item =>
            item.text.toLowerCase().includes(searchLower)
        );
    }, [searchHelperSectionsValue]);

    useEffect(() => {
        if (!convertId && contactId) {
            setExpanendHelper(false)
        }
    }, [contactId, convertId])

    return (
        <div className={classes.wrapper}>
            <div className={classes.contactInfo}>
                <div className={classes.avatarSection}>
                    <img src={config.props?.avatar ? config.props.avatar : avatar} alt="avatar" />
                </div>
                <div className={classes.nameSection}>{config.props?.name ? config.props?.name : reduxSelectedOrganizationName}</div>
                <div className={classes.postSection}>{config.props?.postsNames}</div>
            </div>

            <div className={classes.content}>
                <CustomList
                    title={'C чем работаем?'}
                    searchFunc={setSearchHelperSectionsValue}
                    searchValue={searchHelperSectionsValue}
                    selectedItem={selectedItemHelper}
                    expanded={expanendHelper}
                    onExpandedChange={setExpanendHelper}
                >
                    {filtredHelperSections.map((item) => (
                        <ListElem
                            key={item.id}
                            id={item.id}
                            upperText={item.text}
                            icon={item.icon}
                            linkSegment={item.link}
                            isActive={item?.isActive}
                            clickFunc={() => handlerClickHelper(item.link)}
                            setSelectedItemData={setSelectedItemHelper}
                        />
                    ))}
                </CustomList>

                {/* Используем маппер вместо прямого рендера элемента */}
                {/* <div className={classes.dynamicContent}> */}
                <RightPanelMapper
                    componentType={config.componentType}
                />
                {(!convertId && contactId) && (
                    <CustomComponent></CustomComponent>
                )}
                {/* </div> */}
            </div>
        </div>
    );
}