import React, { useMemo, useState, useEffect } from 'react'
import CustomList from '../../CustomList/CustomList';
import { useAllStatistics } from '@hooks'
import ListElem from '../../CustomList/ListElem';
import statGraph from '@image/statGraph.svg'
import { notEmpty } from '@helpers/helpers'
import { useLocation, useNavigate } from 'react-router-dom'
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import ModalCreateStatistic from '../../../layout/Statistics/ModalCreateStatistic';
import { Button, Space } from 'antd';


export default function StatisticsList() {
    const [seacrhStatisticsSectionsValue, setSeacrhStatisticsSectionsValue] = useState()
    const [openCreateStatistic, setOpenCreateStatistic] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate()
    const location = useLocation()
    // Получение всех статистик
    const {
        statistics,
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
        refetch
    } = useAllStatistics({
        statisticData: false,
        isActive: isActive,
    });

    const filtredStats = useMemo(() => {
        if (!seacrhStatisticsSectionsValue?.trim()) {
            return statistics; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhStatisticsSectionsValue?.toLowerCase();
        return statistics?.filter(item =>
            item?.name.toLowerCase().includes(searchLower)
        );
    }, [seacrhStatisticsSectionsValue, statistics]);

    useEffect(() => {

        if (!notEmpty(statistics)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'statistics') return;

        navigate(`helper/statistics/${statistics[0]?.id}`)
    }, [statistics])


    const openStatistic = (id) => {
        navigate(`helper/statistics/${id}`)
    }

    useEffect(() => {
        const channel = new BroadcastChannel("statisticName_channel");

        const handler = (event) => {
            if (event.data === "name") {
                refetch();
            }
        };

        channel.addEventListener("message", handler);

        return () => {
            channel.removeEventListener("message", handler);
            channel.close();
        };
    }, [refetch]);

    return (
        <>
            <CustomList
                title={'Статистики'}
                searchValue={seacrhStatisticsSectionsValue}
                searchFunc={setSeacrhStatisticsSectionsValue}
            >

                <ListAddButtom textButton={'Создать статсиктику'} clickFunc={() => setOpenCreateStatistic(true)} />


                <Space style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button type={isActive ? "primary" : "default"} onClick={() => setIsActive(true)}>Активная</Button>
                    <Button type={!isActive ? "primary" : "default"} onClick={() => setIsActive(false)}>Архивная</Button>
                </Space>




                {filtredStats.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={statGraph}
                            upperText={item.name}
                            linkSegment={item.id}
                            clickFunc={() => openStatistic(item.id)}
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

