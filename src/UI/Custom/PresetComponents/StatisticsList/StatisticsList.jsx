import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import CustomList from '../../CustomList/CustomList';
import { useAllStatistics, useModuleActions } from '@hooks'
import ListElem from '../../CustomList/ListElem';
import statGraph from '@image/statGraph.svg'
import { notEmpty } from '@helpers/helpers'
import { useLocation, useNavigate } from 'react-router-dom'
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import ModalCreateStatistic from '../../../layout/Statistics/ModalCreateStatistic';
import FilterElement from '../../CustomList/FilterElement'

const arrayFilter = [
    {
        label: "Активные",
        value: true
    },
    {
        label: "Архивные",
        value: false
    }
]

export default function StatisticsList() {
    const [seacrhStatisticsSectionsValue, setSeacrhStatisticsSectionsValue] = useState()
    const [openCreateStatistic, setOpenCreateStatistic] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    
    // Ref для контейнера списка
    const listContainerRef = useRef(null)
    
    // Для хранения ID выбранного элемента
    const [selectedStatisticId, setSelectedStatisticId] = useState(null)
    
    // Флаг для отслеживания необходимости прокрутки
    const [shouldScroll, setShouldScroll] = useState(false)

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

    const { isCreate } = useModuleActions("statistic");

    const filtredStats = useMemo(() => {
        if (!seacrhStatisticsSectionsValue?.trim()) {
            return statistics; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhStatisticsSectionsValue?.toLowerCase();
        return statistics?.filter(item =>
            item?.name.toLowerCase().includes(searchLower)
        );
    }, [seacrhStatisticsSectionsValue, statistics]);

    const openStatistic = (id) => {
        setSelectedStatisticId(id)
        navigate(`helper/statistics/${id}`)
    }

    // Функция для прокрутки к выбранному элементу
    const scrollToSelectedElement = useCallback(() => {
        if (!selectedStatisticId || !listContainerRef.current) return;
        
        // Ждем немного, чтобы DOM успел обновиться
        setTimeout(() => {
            const container = listContainerRef.current;
            if (!container) return;
            
            // Находим выбранный элемент по data-id внутри контейнера
            const selectedElement = container.querySelector(`[data-id="${selectedStatisticId}"]`);
            
            if (selectedElement) {
                // Рассчитываем позицию для плавной прокрутки
                const elementRect = selectedElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const containerScrollTop = container.scrollTop;
                
                // Вычисляем относительную позицию элемента
                const relativeTop = elementRect.top - containerRect.top + containerScrollTop;
                const middleOffset = (containerRect.height / 2) - (elementRect.height / 2);
                
                // Прокручиваем к середине контейнера
                container.scrollTo({
                    top: relativeTop - middleOffset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }, [selectedStatisticId]);

    // Эффект для определения выбранного элемента из URL
    useEffect(() => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        const statisticId = parts[parts.length - 1];
        
        if (statisticId && statisticId !== 'statistics' && statisticId !== 'helper') {
            setSelectedStatisticId(statisticId);
            setShouldScroll(true);
        }
    }, [location.pathname]);

    // Эффект для прокрутки
    useEffect(() => {
        if (shouldScroll && selectedStatisticId && listContainerRef.current && filtredStats?.length > 0) {
            scrollToSelectedElement();
            setShouldScroll(false); // Сбрасываем флаг после прокрутки
        }
    }, [shouldScroll, selectedStatisticId, filtredStats, isActive, scrollToSelectedElement]);

    // Обработчик получения ref контейнера от CustomList
    const handleListContainerRef = useCallback((ref) => {
        listContainerRef.current = ref;
    }, []);

    useEffect(() => {
        if (!notEmpty(statistics)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'statistics') return;

        navigate(`helper/statistics/${statistics[0]?.id}`)
    }, [statistics])

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
                isFilter={true}
                setOpenFilter={setOpenFilter}
                searchValue={seacrhStatisticsSectionsValue}
                searchFunc={setSeacrhStatisticsSectionsValue}
                // Передаем callback для получения ref контейнера
                onListContainerRef={handleListContainerRef}
            >
                {
                    openFilter && <FilterElement
                        array={arrayFilter}
                        state={isActive}
                        setState={setIsActive}
                        setOpenFilter={setOpenFilter}
                    />
                }

                {
                    !openFilter && isCreate && <ListAddButtom textButton={'Создать статистику'} clickFunc={() => setOpenCreateStatistic(true)} />
                }

                {filtredStats.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={statGraph}
                            upperText={item.name}
                            bottomText={item?.post?.name}
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