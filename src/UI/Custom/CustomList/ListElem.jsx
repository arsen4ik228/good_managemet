import React, {useEffect, forwardRef, useState} from 'react'
import classes from './ListElem.module.css'
import avatar from '@image/icon _ GM-large.svg'
import {useFindPathSegment} from '@helpers/helpers'
import {Button, Tooltip} from 'antd'
import nuber_mark from '@image/nuber_mark.svg'
import {EditOutlined} from "@ant-design/icons";
import ModalUpdateOrganization from "../../layout/Organization/ModalUpdateOrganization";

const ListElem = forwardRef(({
                                 id,
                                 icon,
                                 upperText,
                                 colorUpperText,
                                 bottomText,
                                 upperLabel,
                                 bage,
                                 greyBage,
                                 linkSegment,
                                 isActive,
                                 clickFunc,
                                 setSelectedItemData,
                                 isPageProject,
                                 objTargets,
                                 isOrganizationList = false,
                                 modalUpdateOrganization,
                                 allOrganizations,
                                 handleOrganizationNameButtonClick
                             }, ref) => {
    const isSelected = useFindPathSegment(linkSegment)
    const [openModalUpdateOrganization, setOpenModalUpdateOrganization] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Добавляем ref для элемента
    // const elemRef = useRef(null)

    useEffect(() => {
        if (isSelected && setSelectedItemData) {
            setSelectedItemData({
                id,
                icon,
                upperText,
                colorUpperText,
                bottomText,
                bage,
                linkSegment,
                clickFunc
            })
        }
    }, [isSelected])

    return (
        <>
            <div
                // ref={elemRef}
                ref={ref}
                className={`${classes.content} ${isSelected && classes.selected}`}
                onClick={() => clickFunc()}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                data-after={upperLabel}
                data-id={linkSegment} // Добавляем data-id
                data-selected={isSelected} // Добавляем data-selected
            >
                <div className={classes.imgContainer}>
                    <img src={icon ?? avatar} alt="avatar"/>
                </div>
                <Tooltip
                    title={bottomText ? `${upperText} - ${bottomText}` : upperText}
                    mouseEnterDelay={0.3} // 1 секунда задержки
                    placement="right"
                    autoAdjustOverflow={true}
                    destroyTooltipOnHide={true}
                    overlayStyle={{maxWidth: 400}}
                >
                    <div
                        className={classes.text}
                    >
                        <div style={{color: colorUpperText ? colorUpperText : ""}}
                             className={` ${classes.upperTxt}   ${isActive === false && classes.notActive}`}>{upperText}</div>
                        {bottomText && (
                            <div className={classes.bottomTxt}>{bottomText}</div>
                        )}
                    </div>
                </Tooltip>
                {
                    isOrganizationList && isHovered &&
                    <Button icon={<EditOutlined/>} type="text" onClick={() => setOpenModalUpdateOrganization(true)}/>
                }
                {
                    openModalUpdateOrganization && <ModalUpdateOrganization
                        handleOrganizationNameButtonClick={handleOrganizationNameButtonClick}
                        organizationId={id}
                        allOrganizations={allOrganizations}
                        open={openModalUpdateOrganization}
                        setOpen={setOpenModalUpdateOrganization}/>
                }
                <div
                    className={classes.roundSection}
                >
                    {greyBage && !(Number(bage) > 0) ? (
                        <div
                            style={{
                                backgroundColor: '#F0F0F0',
                            }}
                        >
                            <img src={nuber_mark} alt="nuber_mark"/>
                        </div>
                    ) : (
                        <div
                            style={{
                                visibility: (Number(bage) > 0) ? 'visible' : 'hidden'
                            }}
                        >
                            {bage}
                        </div>
                    )}

                </div>

                {
                    isPageProject && (
                        <div
                            className={classes.roundSectionForProject}
                        >

                            {
                                objTargets?.completed !== 0 && <div style={{backgroundColor: "#005475"}}>
                                    {objTargets?.completed}
                                </div>
                            }

                            {
                                objTargets?.expired !== 0 && <div style={{backgroundColor: "#FF4D4F"}}>
                                    {objTargets?.expired}
                                </div>
                            }

                            {
                                objTargets?.normal !== 0 && <div style={{backgroundColor: "#999999"}}>
                                    {objTargets?.normal}
                                </div>
                            }

                        </div>
                    )
                }
            </div>
        </>
    )
})

export default ListElem
