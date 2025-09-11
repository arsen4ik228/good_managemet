import React, { useMemo, useState } from 'react'
import CustomList from '../../CustomList/CustomList';
import { useAllStatistics } from '@hooks'
import ListElem from '../../CustomList/ListElem';
import statGraph from '@image/statGraph.svg' 
import { useNavigate } from 'react-router-dom';


export default function StatisticsList() {
    const [seacrhStatisticsSectionsValue, setSeacrhStatisticsSectionsValue] = useState()
    const navigate = useNavigate()
    // Получение всех статистик
    const {
        statistics,
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
    } = useAllStatistics({
        statisticData: false,
        isActive: true,
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
                {filtredStats.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={statGraph}
                            upperText={item.name}
                            linkSegment={item.id}
                            clickFunc={() => navigate(`${item.id}`)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}

