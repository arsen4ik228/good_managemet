import React, { useEffect, useState } from 'react';
import classes from './MainStatistics.module.css'
import { useNavigate } from "react-router-dom";
import Header from "@Custom/CustomHeader/Header";
import ModalChangeReportDay from './ModalChangeReportDay/ModalChangeReportday';
import { notEmpty } from '@helpers/helpers';
import { useStatisticsHook, useGetReduxOrganization } from '@hooks';

const MainStatistics = () => {

    const navigate = useNavigate()

    const {reduxSelectedOrganizationId} = useGetReduxOrganization()

    const [modalOpen, setModalOpen] = useState(false)
    const [reportDay, setReportDay] = useState()


    const {
        statistics,
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
    } = useStatisticsHook({statisticData: false})

    const {
        organizations 
    } = useGetReduxOrganization()

    const REPORT_DAY = {
        0: 'Вс',
        1: 'Пн',
        2: 'Вт',
        3: 'Ср',
        4: 'Чт',
        5: 'Пт',
        6: 'Сб',
    }

    useEffect(() => {
        if (!notEmpty(organizations)) return 
        setReportDay(organizations?.find(item => item.id === reduxSelectedOrganizationId).reportDay)
    }, [organizations])

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Статистики'} onRightIcon={true}>Личный Помощник</Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}>Выберите Статитстику:</div>
                            <div className={classes.right}>

                                    <>
                                        {/* <div className={classes.titleStrategy}>Статитстики:</div> */}
                                        <div className={classes.addDraft} onClick={() => setModalOpen(true)}>
                                            <span>
                                                Отчётный день: {REPORT_DAY[reportDay]}
                                            </span>
                                            {/* <img src={addIcon} /> */}
                                        </div>
                                        <ul className={classes.selectList}>
                                            {statistics?.map((item, index) => (
                                                <li key={index}
                                                    // style={{ color: item?.state === 'Активный' ? '#005475' : 'none' }}
                                                    onClick={() => navigate(item.id)}
                                                >
                                                    {item?.name}
                                                </li>
                                            ))}
                                            {/* <div className={classes.addDraft}>
                                                <span>
                                                    Создать
                                                </span>
                                                <img src={addIcon} />
                                            </div> */}
                                            {/* {archiveStrategies?.map((item, index) => (
                                                <li key={index} style={{ color: 'grey' }} onClick={() => navigate(item.id)}>
                                                    Стратегия №{item?.strategyNumber}
                                                </li>
                                            ))} */}

                                        </ul>
                                    </>
                                
                            </div>
                        </div>
                    </>


                </div>
            </div>

            {modalOpen && (
                <ModalChangeReportDay
                    setModalOpen={setModalOpen}
                    parenReportDay={reportDay}
                >
                </ModalChangeReportDay>
            )}

        </>
    );
};

export default MainStatistics;