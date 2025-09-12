import React, { useMemo, useState } from 'react'
import CustomList from '../../CustomList/CustomList';
import { useAllStatistics } from '@hooks'
import ListElem from '../../CustomList/ListElem';
import statGraph from '@image/statGraph.svg'
import { useNavigate } from 'react-router-dom';
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import ModalCreateStatistic from '../../../layout/Statistics/ModalCreateStatistic';
import { Button, Space } from 'antd';


export default function StatisticsList() {
    const [seacrhStatisticsSectionsValue, setSeacrhStatisticsSectionsValue] = useState()
    const [openCreateStatistic, setOpenCreateStatistic] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate()
    // Получение всех статистик
    const {
        statistics,
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
    } = useAllStatistics({
        statisticData: false,
        isActive: isActive,
    });

    const filtredStats = useMemo(() => {
        if (!seacrhStatisticsSectionsValue?.trim()) {
            return statistics; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhStatisticsSectionsValue?.toLowerCase();
        return statistics.filter(item =>
            item.name.toLowerCase().includes(searchLower)
        );
    }, [seacrhStatisticsSectionsValue, statistics]);

    return (
        <>
            <CustomList
                title={'Статистики'}
                searchValue={seacrhStatisticsSectionsValue}
                searchFunc={setSeacrhStatisticsSectionsValue}
            >

                <ListAddButtom textButton={'Создать статсиктику'} clickFunc={() => setOpenCreateStatistic(true)} />

        
                <Space style={{
                    width:"100%",
                    display:"flex",
                    justifyContent:"center"
                }}>
                    <Button type= {isActive ? "primary": "default" }  onClick={() => setIsActive(true)}>Активная</Button>
                    <Button   type= {!isActive ? "primary": "default" } onClick={() => setIsActive(false)}>Архивная</Button>
                </Space>
        



                {filtredStats.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={statGraph}
                            upperText={item.name}
                            linkSegment={item.id}
                            clickFunc={() => navigate(`helper/statistics/${item.id}`)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>

            <ModalCreateStatistic
                open={openCreateStatistic}
                setOpen={setOpenCreateStatistic}
            />
        </>
    )
}

