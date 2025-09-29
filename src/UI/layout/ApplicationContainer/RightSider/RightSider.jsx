import React, { useMemo, useState } from 'react';
import classes from './RightSider.module.css';
import avatar from '@image/helper_big_avatar.svg';
import CustomList from '../../../Custom/CustomList/CustomList';
import ListElem from '../../../Custom/CustomList/ListElem';
import stat from '@image/statistic_icon.svg';
import goal from '@image/goal_icon.svg';
import post from '@image/post_icon.svg';
import policy from '@image/poliycy_icon.svg';
import controlPanel_icon from '@image/controlPanel_icon.svg'
import { useNavigate, useParams } from 'react-router-dom';
import RightPanelMapper from '@helpers/RightPanelMapper';
import CustomComponent from './CustomComponent';
import { homeUrl } from '@helpers/constants'

export default function RightSider({ config }) {
    const { organizationId } = useParams()
    const navigate = useNavigate();
    const [searchHelperSectionsValue, setSearchHelperSectionsValue] = useState('');
    const [selectedItemHelper, setSelectedItemHelper] = useState()

    const HELPER_SECTIONS = [
        { id: '7', icon: goal, text: 'Цели', link: 'goal' },
        { id: '6', icon: policy, text: 'Политика', link: 'policy' },
        { id: '1', icon: post, text: 'Посты', link: 'posts' },
        { id: '5', icon: stat, text: 'Статистики', link: 'statistics' },
        { id: '2', icon: controlPanel_icon, text: 'Панель управления', link: 'controlPanel' },
        { id: '3', icon: stat, text: 'Сводка', link: 'svodka' },
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

    console.log(config)
    return (
        <div className={classes.wrapper}>
            <div className={classes.contactInfo}>
                <div className={classes.avatarSection}>
                    <img src={config.props?.avatar ? config.props.avatar : avatar} alt="avatar" />
                </div>
                <div className={classes.nameSection}>{config.props?.name}</div>
                <div className={classes.postSection}>{config.props?.postsNames}</div>
            </div>

            <div className={classes.content}>
                <CustomList
                    title={'C чем работаем?'}
                    searchFunc={setSearchHelperSectionsValue}
                    searchValue={searchHelperSectionsValue}
                    selectedItem={selectedItemHelper}
                >
                    {filtredHelperSections.map((item) => (
                        <ListElem
                            key={item.id}
                            id={item.id}
                            upperText={item.text}
                            icon={item.icon}
                            linkSegment={item.link}
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

                {/* <CustomComponent></CustomComponent> */}
                {/* </div> */}
            </div>
        </div>
    );
}