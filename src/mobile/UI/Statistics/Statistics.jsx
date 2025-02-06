import React, { useState, useEffect } from 'react'
import classes from './Statistics.module.css'
import Header from '../Custom/CustomHeader/Header'
import icon from '../Custom/icon/icon _ downarrow _ 005475.svg'
import { getDateFormatSatatistic, selectedOrganizationId, } from '../../BLL/constans'
import { useParams } from 'react-router-dom'
import { useGetOrganizationsQuery,  } from '../../BLL/organizationsApi'
import saveIcon from '../Custom/icon/icon _ save.svg'
import Graphic from '../Custom/Graph/Graphic'
import HandlerMutation from '../Custom/HandlerMutation'
import iconExit from '../Custom/SearchModal/icon/icon _ add.svg'
import arrowInCircle from '../Custom/icon/arrow in circle.svg'
import { useGetPostsQuery } from '../../BLL/postApi'
import { useStatisticsHook } from '@hooks'

export default function Statistics() {

    const {statisticId} = useParams()

    const [openMenu, setOpenMenu] = useState(false)

    const [type, setType] = useState('null');
    const [name, setName] = useState('null');
    const [postId, setPostId] = useState('null');
    const [description, setDescription] = useState('');
    // const [statisticId, setStatisticId] = useState('');
    const [oldReceivedPoints, setOldReceivedPoints] = useState([]);
    const [receivedPoints, setReceivedPoints] = useState([]);
    const [createPoints, setCreatePoints] = useState([]);

    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);

    const [day, setDay] = useState('');
    const [typeGraphic, setTypeGraphic] = useState('Ежедневный');
    const [disabledPoints, setDisabledPoints] = useState(false);

    const [arrayPoints, setArrayPoints] = useState([]);
    const [showPoints, setShowPoints] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [count, setCount] = useState(0);

    const [organizationId, setOrganizationId] = useState('');
    const [reportDay, setReportDay] = useState('');
    const [reportDayComes, setReportDayComes] = useState('');
    const [postsToOrganization, setPostsToOrganization] = useState([]);

    const [
        disabledReportDayAndSelectStatistics,
        setDisabledReportDayAndSelectStatistics,
    ] = useState(true);

    const [openModaReportDay, setOpenModalReportDay] = useState(false);
    const [showReportDay, setShowReportDay] = useState();
    const [showReportDayComes, setShowReportDayComes] = useState();

    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessResetOrganization, setManualSuccessResetOrganization] =
        useState(true);
    const [manualErrorResetOrganization, setManualErrorResetOrganization] =
        useState(true);


    const {
        posts = [],
        isLoadingGetPosts,
        isErrorGetPosts,
    } = useGetPostsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            posts: data || [],
            isLoadingGetPosts: isLoading,
            isErrorGetPosts: isError,
        }),
    });
    console.log(posts)

    const {
        currentStatistic,
        statisticDatas,
        isLoadingGetStatisticId,
        isErrorGetStatisticId,
        isFetchingGetStatisticId,

        updateStatistics,
        isLoadingUpdateStatisticMutation,
        isSuccessUpdateStatisticMutation,
        isErrorUpdateStatisticMutation,
        ErrorUpdateStatisticMutation,


    } = useStatisticsHook({statisticId: statisticId})


    const {
        organizations = [],
    } = useGetOrganizationsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            organizations: data?.organizations || [],
            isLoadingOrganizations: isLoading,
            isFetchingOrganizations: isFetching,
            isErrorOrganizations: isError,
        }),
    });

    useEffect(() => { // Установка organizationId для поиска постов и отчётного дня
        if (Object.keys(currentStatistic).length > 0 && posts.length > 0 && organizations.length > 0) {
            const orgId = selectedOrganizationId
            if (orgId) {
                setOrganizationId(orgId)

                const report = organizations?.filter(
                    (item) => item?.id === orgId
                );

                const arrayPosts = posts?.filter(
                    (item) => item?.organization?.id === orgId
                );
                setDisabledReportDayAndSelectStatistics(false);
                setPostsToOrganization(arrayPosts);

                setReportDay(report[0]?.reportDay);
                setReportDayComes(report[0]?.reportDay);
            }
        }
    }, [currentStatistic, posts, organizations])
  

    // Все для начальной страницы
    useEffect(() => {
        if (typeGraphic !== 'Ежедневный') {
            setDisabledPoints(true);
        } else {
            setDisabledPoints(false);
        }
    }, [typeGraphic]);

    useEffect(() => {
        if (statisticDatas.length > 0) {
            reset(currentStatistic.name);
        }
    }, [currentStatistic, isLoadingGetStatisticId, isFetchingGetStatisticId]);

    useEffect(() => {
        if (currentStatistic.type && currentStatistic.type !== type)
            setType(currentStatistic.type)
    }, [currentStatistic])

    useEffect(() => {
        console.warn(statisticDatas.length, reportDay)

        if (statisticDatas.length > 0 && reportDay) {
            setReceivedPoints([]);
            setCreatePoints([]);
            setOldReceivedPoints([]);
            setArrayPoints([]);
            setShowPoints([]);
            setCount(0);
            setDay(reportDay);
            console.warn('first')
            if (typeGraphic === 'Ежедневный' && day !== '') {
                const dayNow = new Date();
                console.warn('useEffect')
                const currentWeekday = dayNow.getDay(); // Текущий день недели (0 - Воскресенье, 1 - Понедельник и т.д.)

                // Определяем начальную дату - ближайший предыдущий день `day`
                const startDate = new Date(dayNow);
                let dayDifference;

                if (currentWeekday >= day) {
                    dayDifference = currentWeekday - day;
                } else {
                    dayDifference = 7 - (day - currentWeekday);
                }

                startDate.setDate(dayNow.getDate() - dayDifference);
                console.log(day)
                console.log(reportDay)
                console.log(startDate);

                // Вычисляем конечную дату (b = startDate + 7 дней)
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 7);

                // Генерируем массив всех дат в диапазоне [startDate, endDate)
                const allDates = [];
                for (
                    let date = new Date(startDate);
                    date < endDate;
                    date.setDate(date.getDate() + 1)
                ) {
                    allDates.push(new Date(date).toISOString().split('T')[0]);
                }

                // Фильтруем данные и заполняем пропущенные даты
                const filteredData = statisticDatas
                    ?.filter((item) => {
                        // Проверяем, если valueDate существует и валиден
                        const itemDate = item?.valueDate ? new Date(item.valueDate) : null;

                        // Если itemDate не валидная, пропускаем элемент
                        if (isNaN(itemDate?.getTime())) {
                            return false; // Пропускаем невалидные даты
                        }

                        // Проверяем, если startDate и endDate валидные
                        const isValidStartDate =
                            startDate instanceof Date && !isNaN(startDate.getTime());
                        const isValidEndDate =
                            endDate instanceof Date && !isNaN(endDate.getTime());

                        if (!isValidStartDate || !isValidEndDate) {
                            return false; // Пропускаем, если startDate или endDate невалидны
                        }

                        const itemDateStr = itemDate.toISOString().split('T')[0];
                        const startDateStr = startDate.toISOString().split('T')[0];
                        const endDateStr = endDate.toISOString().split('T')[0];

                        // Возвращаем результат фильтрации
                        return (
                            startDateStr <= itemDateStr &&
                            itemDateStr < endDateStr &&
                            item.isCorrelation !== true
                        );
                    })
                    ?.map((item) => ({
                        ...item,
                        valueDate: item.valueDate?.split('T')[0], // Предполагаем, что valueDate - строка с датой
                    }));

                const updatedPoints = [];
                const _updatedPoints = [];
                const _createdPoints = [];

                allDates.forEach((date) => {
                    const existingPoint = filteredData.find(
                        (item) => item.valueDate === date
                    );

                    if (existingPoint) {
                        updatedPoints.push(existingPoint);
                        _updatedPoints.push({ ...existingPoint });
                    } else {
                        _createdPoints.push({
                            id: date,
                            valueDate: date,
                            value: '',
                            isCorrelation: false,
                        });
                    }
                });

                // Сортируем данные по убыванию даты
                updatedPoints.sort(
                    (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
                );
                _updatedPoints.sort(
                    (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
                );
                _createdPoints.sort(
                    (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
                );

                // Устанавливаем данные
                setOldReceivedPoints(_updatedPoints);
                setReceivedPoints(updatedPoints);
                setCreatePoints(_createdPoints);
            }

            else if (typeGraphic === 'Ежемесячный') {
                // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
                const monthlyData = statisticDatas.reduce((acc, item) => {
                    const itemDate = new Date(item.valueDate);
                    const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
                    if (
                        !isNaN(itemDate) &&
                        new Date(new Date().setMonth(new Date().getMonth() - 13)) < itemDate
                    ) {
                        if (item?.isCorrelation === true) {
                            acc[monthKey] = {
                                id: item.id,
                                valueSum: item.value,
                                year: itemDate.getFullYear(),
                                month: itemDate.getMonth() + 1,
                                isCorrelation: true,
                            };
                        }

                        // Если месяца ещё нет в acc, создаем начальный объект с valueSum = 0
                        if (!acc[monthKey] || !acc[monthKey]?.isCorrelation) {
                            if (!acc[monthKey]) {
                                acc[monthKey] = {
                                    valueSum: 0,
                                    year: itemDate.getFullYear(),
                                    month: itemDate.getMonth() + 1,
                                    isCorrelation: false,
                                };
                            }
                            acc[monthKey].valueSum += item.value;
                        }
                    }
                    return acc;
                }, {});

                // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
                const updatedMonthlyPoints = [];

                // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
                for (let i = 0; i < 13; i++) {
                    const monthDate = new Date();
                    monthDate.setMonth(monthDate.getMonth() - i);
                    const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1
                        }`;

                    // Если данных нет для этого месяца, создаем запись с суммой 0
                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = {
                            valueSum: 0,
                            year: monthDate.getFullYear(),
                            month: monthDate.getMonth() + 1,
                            isCorrelation: false,
                        };
                    }

                    const lastDayOfMonth = new Date(
                        monthDate.getFullYear(),
                        monthDate.getMonth() + 1,
                        0
                    ); // Получаем последний день месяца
                    const year = lastDayOfMonth.getFullYear();
                    const monthValue = lastDayOfMonth.getMonth() + 1; // Месяцы начинаются с 0
                    const date = lastDayOfMonth.getDate(); // Дата

                    updatedMonthlyPoints.push({
                        id: monthlyData[monthKey]?.id || null, // Если id не найден, присваиваем null
                        valueDate: `${year}-${monthValue}-${date}`, // Форматирование в 'год-месяц-день'
                        value: monthlyData[monthKey].valueSum, // Сумма за месяц
                        isCorrelation: monthlyData[monthKey].isCorrelation,
                    });
                }

                // Сортируем данные по дате, от последнего месяца к первому
                updatedMonthlyPoints.sort(
                    (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
                );

                setReceivedPoints(updatedMonthlyPoints);
            }

            else if (typeGraphic === 'Ежегодовой') {
                // Группируем данные по годам и суммируем `valueDate` за каждый год
                const yearData = statisticDatas.reduce((acc, item) => {
                    const itemDate = new Date(item.valueDate);
                    const yearKey = `${itemDate.getFullYear()}`;
                    // Проверяем, что дата корректна и меньше чем на 13 лет от текущего года
                    if (
                        !isNaN(itemDate) &&
                        new Date().getFullYear() - 12 < itemDate.getFullYear()
                    ) {
                        if (item?.isCorrelation === true) {
                            acc[yearKey] = {
                                id: item.id,
                                valueSum: item.value,
                                year: itemDate.getFullYear(),
                                isCorrelation: true,
                            };
                        }

                        // Если года еще нет в acc, создаем начальный объект с valueSum = 0
                        if (!acc[yearKey] || !acc[yearKey]?.isCorrelation) {
                            if (!acc[yearKey]) {
                                acc[yearKey] = {
                                    valueSum: 0,
                                    year: itemDate.getFullYear(),
                                    isCorrelation: false,
                                };
                            }
                            acc[yearKey].valueSum += item.value;
                        }
                    }
                    return acc;
                }, {});

                // Формируем новый массив, включающий `valueDate` и `date` (первый день года)
                const updatedYearPoints = [];

                // Для каждого года от 13 лет назад до текущего добавляем данные
                for (let i = 0; i < 12; i++) {
                    const yearDate = new Date();
                    yearDate.setFullYear(yearDate.getFullYear() - i);
                    const yearKey = `${yearDate.getFullYear()}`;

                    // Если данных нет для этого года, создаем запись с суммой 0
                    if (!yearData[yearKey]) {
                        yearData[yearKey] = {
                            valueSum: 0,
                            year: yearDate.getFullYear(),
                            isCorrelation: false,
                        };
                    }

                    updatedYearPoints.push({
                        id: yearData[yearKey]?.id || null, // Если id не найден, присваиваем null
                        valueDate: `${yearDate.getFullYear()}-01-01`, // Форматирование в 'год-01-01'
                        value: yearData[yearKey].valueSum, // Сумма за год
                        isCorrelation: yearData[yearKey].isCorrelation,
                    });
                }

                // Сортируем данные по дате, от последнего года к первому
                updatedYearPoints.sort(
                    (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
                );

                setReceivedPoints(updatedYearPoints);
            }

            else if (typeGraphic === '13') {
                const today = new Date();
                const end = new Date(today);
                const start = new Date();
                start.setDate(today.getDate() - 14 * 7);

                const selectedDayOfWeek = parseInt(day);
                const result = [];
                let currentDate = new Date(start);
                let currentSum = 0;

                // Перемещаем currentDate на первый выбранный день недели
                while (currentDate.getDay() !== selectedDayOfWeek) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Цикл по неделям
                while (currentDate <= end) {
                    const nextDate = new Date(currentDate);
                    nextDate.setDate(currentDate.getDate() + 7);

                    // Фильтруем и суммируем значения для текущей недели
                    currentSum = statisticDatas
                        .filter((item) => {
                            const itemDate = new Date(item.valueDate);
                            if (
                                currentDate <= itemDate &&
                                itemDate < nextDate &&
                                item.isCorrelation !== true
                            ) {
                                setArrayPoints((prevState) => [...prevState, item]);
                            }
                            return (
                                currentDate <= itemDate &&
                                itemDate < nextDate &&
                                item.isCorrelation !== true
                            );
                        })
                        .reduce((sum, item) => sum + item.value, 0);

                    // Создаем новую дату на день позже
                    const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

                    // Проверяем, что valueDate не позже сегодняшней даты
                    if (valueDate <= today) {
                        setArrayPoints((prevState) =>
                            prevState.map((item) => {
                                if (item.myID) {
                                    return { ...item };
                                } else {
                                    return {
                                        ...item,
                                        myID: valueDate.toISOString().split('T')[0],
                                    };
                                }
                            })
                        );

                        result.push({
                            value: currentSum,
                            valueDate: valueDate.toISOString().split('T')[0],
                        });
                    }

                    currentDate = nextDate; // Переходим к следующей неделе
                }

                setReceivedPoints(
                    result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
                );
            }

            else if (typeGraphic === '26') {
                const today = new Date();
                const end = new Date(today);
                const start = new Date();
                start.setDate(today.getDate() - 27 * 7);

                const selectedDayOfWeek = parseInt(day);
                const result = [];
                let currentDate = new Date(start);
                let currentSum = 0;

                // Перемещаем currentDate на первый выбранный день недели
                while (currentDate.getDay() !== selectedDayOfWeek) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Цикл по неделям
                while (currentDate <= end) {
                    const nextDate = new Date(currentDate);
                    nextDate.setDate(currentDate.getDate() + 7);

                    // Фильтруем и суммируем значения для текущей недели
                    currentSum = statisticDatas
                        .filter((item) => {
                            const itemDate = new Date(item.valueDate);
                            if (
                                currentDate <= itemDate &&
                                itemDate < nextDate &&
                                item.isCorrelation !== true
                            ) {
                                setArrayPoints((prevState) => [...prevState, item]);
                            }
                            return (
                                currentDate <= itemDate &&
                                itemDate < nextDate &&
                                item.isCorrelation !== true
                            );
                        })
                        .reduce((sum, item) => sum + item.value, 0);

                    // Создаем новую дату на день позже
                    const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

                    // Проверяем, что valueDate не позже сегодняшней даты
                    if (valueDate <= today) {
                        setArrayPoints((prevState) =>
                            prevState.map((item) => {
                                if (item.myID) {
                                    return { ...item };
                                } else {
                                    return {
                                        ...item,
                                        myID: valueDate.toISOString().split('T')[0],
                                    };
                                }
                            })
                        );

                        result.push({
                            value: currentSum,
                            valueDate: valueDate.toISOString().split('T')[0],
                        });
                    }

                    currentDate = nextDate; // Переходим к следующей неделе
                }

                setReceivedPoints(
                    result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
                );
            }

            else if (typeGraphic === '52') {
                const today = new Date();
                const end = new Date(today);
                const start = new Date();
                start.setDate(today.getDate() - 53 * 7);

                const selectedDayOfWeek = parseInt(day);
                const result = [];
                let currentDate = new Date(start);
                let currentSum = 0;

                // Перемещаем currentDate на первый выбранный день недели
                while (currentDate.getDay() !== selectedDayOfWeek) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Цикл по неделям
                while (currentDate <= end) {
                    const nextDate = new Date(currentDate);
                    nextDate.setDate(currentDate.getDate() + 7);

                    // Фильтруем и суммируем значения для текущей недели
                    currentSum = statisticDatas
                        .filter((item) => {
                            const itemDate = new Date(item.valueDate);
                            if (
                                currentDate <= itemDate &&
                                itemDate < nextDate &&
                                item.isCorrelation !== true
                            ) {
                                setArrayPoints((prevState) => [...prevState, item]);
                            }
                            return (
                                currentDate <= itemDate &&
                                itemDate < nextDate &&
                                item.isCorrelation !== true
                            );
                        })
                        .reduce((sum, item) => sum + item.value, 0);

                    // Создаем новую дату на день позже
                    const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

                    // Проверяем, что valueDate не позже сегодняшней даты
                    if (valueDate <= today) {
                        setArrayPoints((prevState) =>
                            prevState.map((item) => {
                                if (item.myID) {
                                    return { ...item };
                                } else {
                                    return {
                                        ...item,
                                        myID: valueDate.toISOString().split('T')[0],
                                    };
                                }
                            })
                        );

                        result.push({
                            value: currentSum,
                            valueDate: valueDate.toISOString().split('T')[0],
                        });
                    }

                    currentDate = nextDate; // Переходим к следующей неделе
                }

                setReceivedPoints(
                    result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
                );
            }
        }
    }, [
        // currentStatistic.id,
        statisticDatas,
        isLoadingGetStatisticId,
        isFetchingGetStatisticId,
        typeGraphic,
        reportDay,
        day,
    ]);


    function compareArrays(oldArray, newArray) {
        const changes = [];
        newArray.forEach((newItem) => {
            const oldItem = oldArray.find((item) => item.id === newItem.id);

            if (oldItem) {
                const itemChanges = {};

                ['value', 'valueDate'].forEach((key) => {
                    if (newItem[key] !== oldItem[key]) {
                        if (key == 'valueDate') {
                            itemChanges[key] = new Date(newItem[key]);
                        } else {
                            itemChanges[key] = newItem[key];
                        }
                    }
                });

                if (Object.keys(itemChanges).length > 0) {
                    changes.push({ _id: newItem.id, ...itemChanges });
                }
            }
        });

        return changes;
    }

    const saveUpdateStatistics = async () => {
        const Data = {};

        if (type !== 'null' && type !== currentStatistic.type) {
            Data.type = type;
        }
        if (name !== 'null' && name !== currentStatistic.name) {
            Data.name = name;
        }
        if (postId !== 'null' && postId !== currentStatistic?.post?.id) {
            Data.postId = postId;
        }
        if (description !== '' && description !== currentStatistic.description) {
            Data.description = description;
        }
        if (createPoints.length > 0) {
            const array = createPoints.filter((item) => item.value !== '');
            if (array.length > 0) {
                const formatDate = array.map((item) => {
                    return {
                        value: item.value,
                        valueDate: new Date(item.valueDate),
                        isCorrelation: false,
                    };
                });
                Data.statisticDataCreateDtos = formatDate;
            }
        }
        if (receivedPoints.length > 0) {
            const array = compareArrays(oldReceivedPoints, receivedPoints);
            if (array.length > 0) {
                Data.statisticDataUpdateDtos = [];
                Data.statisticDataUpdateDtos.push(...array);
            }
        }
        console.log(Data);
        if (Object.keys(Data).length > 0) {
            await updateStatistics({
                _id: statisticId,
                ...Data,
            })
                .unwrap()
                .then(() => {
                    setManualSuccessReset(false);
                    setManualErrorReset(false);

                    setManualSuccessResetOrganization(true);
                    setManualErrorResetOrganization(true);
                    reset();

                    // if (Data.name) {
                    //   refetch();
                    // }

                    setOpenModalReportDay(false);
                })
                .catch((error) => {
                    setManualErrorReset(false);

                    setManualSuccessResetOrganization(true);
                    setManualErrorResetOrganization(true);

                    console.error('Ошибка:', JSON.stringify(error, null, 2)); // выводим детализированную ошибку
                });
        }
    };

    const addPoint = () => {
        setCreatePoints((prevState) => [
            { valueDate: '', value: 0, id: new Date() },
            ...prevState,
        ]);
    };

    const deletePoint = () => {
        setCreatePoints((prevState) => prevState.slice(0, -1));
    };

    const onChangePoints = (nameArrray, value, type, index, id) => {
        if (nameArrray === 'received') {
            const updatedPoints = [...receivedPoints];
            if (type === 'value') {
                updatedPoints[index][type] = Number(value);
            } else {
                updatedPoints[index][type] = value;
            }
            setReceivedPoints(updatedPoints);
        } else {
            setCreatePoints((prevState) => {
                const updatedPoints = prevState.map((item) => {
                    if (item.id === id) {
                        return type === 'value'
                            ? { ...item, value: Number(value) }
                            : { ...item, valueDate: value };
                    }
                    return item;
                });

                updatedPoints.sort(
                    (a, b) => Date.parse(b.valueDate) - Date.parse(a.valueDate)
                );
                return updatedPoints;
            });
        }
    };

    const reset = (name) => {
        setType('null');
        setName(name);
        setPostId('null');
        setDescription('');
        setCreatePoints([]);
    };

    const handleArrowLeftClick = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const handleArrowRightClick = () => {
        setCount((prevCount) => prevCount - 1);
    };

    // Все для модального окна при нажатии на блок координат точек для статистики
    const exitModal = () => {
        setShowPoints([]);
        setActiveIndex(null);
        setOpenModal(false);
    };

    const showCurrentPoint = (id) => {
        setOpenModal(true);

        const end = new Date(id);
        let start = new Date(id);
        if (typeGraphic === 'Ежемесячный' || typeGraphic === 'Ежегодовой') {
            const elementIsCorrelation = receivedPoints.filter(
                (item) =>
                    new Date(item.valueDate).toDateString() === end.toDateString() &&
                    item.isCorrelation === true
            );
            if (elementIsCorrelation.length > 0) {
                setShowPoints(elementIsCorrelation);
            } else {
                setShowPoints((prevState) => [
                    ...prevState,
                    { valueDate: end, value: '', isCorrelation: false },
                ]);
            }
        } else {
            start.setDate(end.getDate() - 7); //Вот тут происходит вычисление количества дат в модальном окне
            const array = arrayPoints
                .filter((item) => item.myID === id)
                .sort((a, b) => new Date(a.valueDate) - new Date(b.valueDate));

            const arrayNew = [];

            if (array.length < 7) {
                // Проходим по всем датам от start до end
                while (start < end) {
                    // Ищем элемент, соответствующий текущей дате start
                    const foundItem = array.find(
                        (item) =>
                            new Date(item.valueDate).toDateString() === start.toDateString()
                    );

                    if (foundItem) {
                        // Если нашли, добавляем его в arrayNew
                        arrayNew.push(foundItem);
                    } else {
                        // Если не нашли, добавляем объект с нулевым значением
                        arrayNew.push({
                            valueDate: start.toISOString(), // Для сохранения даты в правильном формате
                            value: '',
                        });
                    }

                    // Переходим к следующему дню
                    start.setDate(start.getDate() + 1);
                }
                setShowPoints(arrayNew);
            } else {
                setShowPoints(array);
            }
        }
    };

    const updateModalPoint = (value, index) => {
        const updatedShowPoints = [...showPoints];
        const update = updatedShowPoints.map((item) => ({
            ...item,
            isCorrelation: false,
        })); /// добавил 26.11.2024
        if (typeGraphic === 'Ежемесячный' || typeGraphic === 'Ежегодовой') {
            update[index]['value'] = Number(value);
            update[index]['isCorrelation'] = true;
            setShowPoints(update);
        } else {
            update[index]['value'] = Number(value);
            setShowPoints(update);
        }
    };

    const saveModalPoints = async (array) => {
        const Data = {};
        if (typeGraphic === 'Ежемесячный' || typeGraphic === 'Ежегодовой') {
            if (array[0]['id']) {
                const arrayReceived = array.map((item) => ({
                    _id: item.id,
                    value: item.value,
                    valueDate: item.valueDate,
                    isCorrelation: item.isCorrelation,
                }));
                Data.statisticDataUpdateDtos = arrayReceived;
            } else {
                const formatDate = array.map((item) => {
                    return {
                        ...item,
                        valueDate: new Date(item.valueDate),
                        isCorrelation: item.isCorrelation,
                    };
                });
                Data.statisticDataCreateDtos = formatDate;
            }
        } else {
            const endArray = array.filter((item) => item.value != '');
            const create = endArray.filter((item) => !item.id);
            const received = endArray
                .filter((item) => item.id)
                .map((item) => ({
                    _id: item.id,
                    value: item.value,
                    valueDate: item.valueDate,
                    isCorrelation: item.isCorrelation,
                }));

            if (create.length > 0) {
                const formatDate = create.map((item) => {
                    return {
                        ...item,
                        valueDate: new Date(item.valueDate),
                        isCorrelation: item.isCorrelation,
                    };
                });
                Data.statisticDataCreateDtos = formatDate;
            }
            if (received.length > 0) {
                Data.statisticDataUpdateDtos = received;
            }
        }
        await updateStatistics({
            statisticId,
            _id: statisticId,
            ...Data,
        })
            .unwrap()
            .then(() => {
                setManualSuccessReset(false);
                setManualErrorReset(false);
                setOpenModal(false);
                setActiveIndex(null);
            })
            .catch((error) => {
                setManualErrorReset(false);
                console.error('Ошибка:', JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    useEffect(() => {
        updateStatisticsData();
    }, [count]);

    const updateStatisticsData = () => {
        setReceivedPoints([]);
        setArrayPoints([]);
        setShowPoints([]);

        if (statisticDatas.length > 0 && typeGraphic === 'Ежедневный') {
            const dayNow = new Date();
            const currentWeekday = dayNow.getDay(); // Текущий день недели (0 - Воскресенье, 1 - Понедельник и т.д.)

            // Определяем начальную дату - ближайший предыдущий день `day`, не более 7 дней назад
            const startDate = new Date(dayNow);
            let dayDifference;

            if (currentWeekday >= day) {
                dayDifference = currentWeekday - day;
            } else {
                dayDifference = 7 - (day - currentWeekday);
            }

            startDate.setDate(dayNow.getDate() - dayDifference);

            // Ограничиваем начальную дату максимум 7 днями назад от текущего дня
            const maxStartDate = new Date(dayNow);
            maxStartDate.setDate(dayNow.getDate() - 7);

            if (startDate < maxStartDate) {
                startDate.setTime(maxStartDate.getTime());
            }

            // Создаем массив всех дат за последние 7 дней
            const last7Days = [];
            for (let i = count; i < 7 + count; i++) {
                const date = new Date(dayNow);
                date.setDate(dayNow.getDate() - i);
                last7Days.push(date.toISOString().split('T')[0]);
            }

            // Группируем данные по дате и фильтруем
            const dataMap = statisticDatas.reduce((acc, item) => {
                const itemDate = item.valueDate.split('T')[0];
                acc[itemDate] = {
                    ...item,
                    valueDate: itemDate,
                };
                return acc;
            }, {});

            // Создаем массив данных для последних 7 дней, добавляем нулевые значения, если данные отсутствуют
            const updatedPoints = last7Days.map((date) => {
                if (dataMap[date] && dataMap[date].isCorrelation !== true) {
                    return dataMap[date];
                } else {
                    return {
                        id: date,
                        valueDate: date,
                        value: '', // Заполняем нулевым значением, если данных за день нет
                        isCorrelation: false,
                    };
                }
            });

            const crPoints = updatedPoints.filter((item) => item.value === '');
            const _updatedPoints = updatedPoints.filter((item) => item.value !== '');

            const updatedPoints1 = _updatedPoints.map((item) => ({ ...item }));

            setOldReceivedPoints(updatedPoints1);
            setReceivedPoints(_updatedPoints);
            setCreatePoints(crPoints);
        }

        if (statisticDatas.length > 0 && typeGraphic === 'Ежемесячный') {
            // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
            const monthlyData = statisticDatas.reduce((acc, item) => {
                const itemDate = new Date(item.valueDate);
                const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
                if (
                    !isNaN(itemDate) &&
                    new Date(new Date().setMonth(new Date().getMonth() - 14 + count)) <
                    itemDate
                ) {
                    if (item?.isCorrelation === true) {
                        acc[monthKey] = {
                            id: item.id,
                            valueSum: item.value,
                            year: itemDate.getFullYear(),
                            month: itemDate.getMonth() + 1,
                            isCorrelation: true,
                        };
                    }

                    // Если месяца ещё нет в acc, создаем начальный объект с valueSum = 0
                    if (!acc[monthKey] || !acc[monthKey]?.isCorrelation) {
                        if (!acc[monthKey]) {
                            acc[monthKey] = {
                                valueSum: 0,
                                year: itemDate.getFullYear(),
                                month: itemDate.getMonth() + 1,
                                isCorrelation: false,
                            };
                        }
                        acc[monthKey].valueSum += item.value;
                    }
                }
                return acc;
            }, {});

            // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
            const updatedMonthlyPoints = [];

            // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
            for (let i = count; i < 13 + count; i++) {
                const monthDate = new Date();
                monthDate.setMonth(monthDate.getMonth() - i);
                const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1
                    }`;

                // Если данных нет для этого месяца, создаем запись с суммой 0
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = {
                        valueSum: 0,
                        year: monthDate.getFullYear(),
                        month: monthDate.getMonth() + 1,
                        isCorrelation: false,
                    };
                }

                const lastDayOfMonth = new Date(
                    monthDate.getFullYear(),
                    monthDate.getMonth() + 1,
                    0
                ); // Получаем последний день месяца
                const year = lastDayOfMonth.getFullYear();
                const monthValue = lastDayOfMonth.getMonth() + 1; // Месяцы начинаются с 0
                const date = lastDayOfMonth.getDate(); // Дата

                updatedMonthlyPoints.push({
                    id: monthlyData[monthKey]?.id || null, // Если id не найден, присваиваем null
                    valueDate: `${year}-${monthValue}-${date}`, // Форматирование в 'год-месяц-день'
                    value: monthlyData[monthKey].valueSum, // Сумма за месяц
                    isCorrelation: monthlyData[monthKey].isCorrelation,
                });
            }

            // Сортируем данные по дате, от последнего месяца к первому
            updatedMonthlyPoints.sort(
                (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
            );

            setReceivedPoints(updatedMonthlyPoints);
        }

        if (statisticDatas.length > 0 && typeGraphic === 'Ежегодовой') {
            // Группируем данные по годам и суммируем `valueDate` за каждый год
            const yearData = statisticDatas.reduce((acc, item) => {
                const itemDate = new Date(item.valueDate);
                const yearKey = `${itemDate.getFullYear()}`;
                // Проверяем, что дата корректна и меньше чем на 13 лет от текущего года
                if (
                    !isNaN(itemDate) &&
                    new Date().getFullYear() - 12 < itemDate.getFullYear()
                ) {
                    if (item?.isCorrelation === true) {
                        acc[yearKey] = {
                            id: item.id,
                            valueSum: item.value,
                            year: itemDate.getFullYear(),
                            isCorrelation: true,
                        };
                    }

                    // Если года еще нет в acc, создаем начальный объект с valueSum = 0
                    if (!acc[yearKey] || !acc[yearKey]?.isCorrelation) {
                        if (!acc[yearKey]) {
                            acc[yearKey] = {
                                valueSum: 0,
                                year: itemDate.getFullYear(),
                                isCorrelation: false,
                            };
                        }
                        acc[yearKey].valueSum += item.value;
                    }
                }
                return acc;
            }, {});

            // Формируем новый массив, включающий `valueDate` и `date` (первый день года)
            const updatedYearPoints = [];

            // Для каждого года от 13 лет назад до текущего добавляем данные
            for (let i = count; i < 12 + count; i++) {
                const yearDate = new Date();
                yearDate.setFullYear(yearDate.getFullYear() - i);
                const yearKey = `${yearDate.getFullYear()}`;

                // Если данных нет для этого года, создаем запись с суммой 0
                if (!yearData[yearKey]) {
                    yearData[yearKey] = {
                        valueSum: 0,
                        year: yearDate.getFullYear(),
                        isCorrelation: false,
                    };
                }

                updatedYearPoints.push({
                    id: yearData[yearKey]?.id || null, // Если id не найден, присваиваем null
                    valueDate: `${yearDate.getFullYear()}-01-01`, // Форматирование в 'год-01-01'
                    value: yearData[yearKey].valueSum, // Сумма за год
                    isCorrelation: yearData[yearKey].isCorrelation,
                });
            }

            // Сортируем данные по дате, от последнего года к первому
            updatedYearPoints.sort(
                (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
            );

            setReceivedPoints(updatedYearPoints);
        }

        if (statisticDatas.length > 0 && typeGraphic === '13') {
            const today = new Date();
            today.setDate(today.getDate() - count * 7);
            const end = new Date(today);

            const start = new Date(end);
            start.setDate(end.getDate() - 14 * 7);

            const selectedDayOfWeek = parseInt(day);
            const result = [];

            let currentDate = new Date(start);
            let currentSum = 0;

            // Перемещаем currentDate на первый выбранный день недели
            while (currentDate.getDay() !== selectedDayOfWeek) {
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Цикл по неделям
            while (currentDate <= end) {
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 7);

                // Фильтруем и суммируем значения для текущей недели
                currentSum = statisticDatas
                    .filter((item) => {
                        const itemDate = new Date(item.valueDate);
                        if (
                            currentDate <= itemDate &&
                            itemDate < nextDate &&
                            item.isCorrelation !== true
                        ) {
                            setArrayPoints((prevState) => [...prevState, item]);
                        }
                        return (
                            currentDate <= itemDate &&
                            itemDate < nextDate &&
                            item.isCorrelation !== true
                        );
                    })
                    .reduce((sum, item) => sum + item.value, 0);

                // Создаем новую дату на день позже
                const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

                // Проверяем, что valueDate не позже сегодняшней даты
                if (valueDate <= today) {
                    setArrayPoints((prevState) =>
                        prevState.map((item) => {
                            if (item.myID) {
                                return { ...item };
                            } else {
                                return {
                                    ...item,
                                    myID: valueDate.toISOString().split('T')[0],
                                };
                            }
                        })
                    );

                    result.push({
                        value: currentSum,
                        valueDate: valueDate.toISOString().split('T')[0],
                    });
                }

                currentDate = nextDate; // Переходим к следующей неделе
            }

            setReceivedPoints(
                result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
            );
        }

        if (statisticDatas.length > 0 && typeGraphic === '26') {
            const today = new Date();
            today.setDate(today.getDate() - count * 7);
            const end = new Date(today);

            const start = new Date(end);
            start.setDate(end.getDate() - 27 * 7);

            const selectedDayOfWeek = parseInt(day);
            const result = [];

            let currentDate = new Date(start);
            let currentSum = 0;

            // Перемещаем currentDate на первый выбранный день недели
            while (currentDate.getDay() !== selectedDayOfWeek) {
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Цикл по неделям
            while (currentDate <= end) {
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 7);

                // Фильтруем и суммируем значения для текущей недели
                currentSum = statisticDatas
                    .filter((item) => {
                        const itemDate = new Date(item.valueDate);
                        if (
                            currentDate <= itemDate &&
                            itemDate < nextDate &&
                            item.isCorrelation !== true
                        ) {
                            setArrayPoints((prevState) => [...prevState, item]);
                        }
                        return (
                            currentDate <= itemDate &&
                            itemDate < nextDate &&
                            item.isCorrelation !== true
                        );
                    })
                    .reduce((sum, item) => sum + item.value, 0);

                // Создаем новую дату на день позже
                const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

                // Проверяем, что valueDate не позже сегодняшней даты
                if (valueDate <= today) {
                    setArrayPoints((prevState) =>
                        prevState.map((item) => {
                            if (item.myID) {
                                return { ...item };
                            } else {
                                return {
                                    ...item,
                                    myID: valueDate.toISOString().split('T')[0],
                                };
                            }
                        })
                    );

                    result.push({
                        value: currentSum,
                        valueDate: valueDate.toISOString().split('T')[0],
                    });
                }

                currentDate = nextDate; // Переходим к следующей неделе
            }

            setReceivedPoints(
                result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
            );
        }

        if (statisticDatas.length > 0 && typeGraphic === '52') {
            const today = new Date();
            today.setDate(today.getDate() - count * 7);
            const end = new Date(today);

            const start = new Date(end);
            start.setDate(end.getDate() - 53 * 7);

            const selectedDayOfWeek = parseInt(day);
            const result = [];

            let currentDate = new Date(start);
            let currentSum = 0;

            // Перемещаем currentDate на первый выбранный день недели
            while (currentDate.getDay() !== selectedDayOfWeek) {
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Цикл по неделям
            while (currentDate <= end) {
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 7);

                // Фильтруем и суммируем значения для текущей недели
                currentSum = statisticDatas
                    .filter((item) => {
                        const itemDate = new Date(item.valueDate);
                        if (
                            currentDate <= itemDate &&
                            itemDate < nextDate &&
                            item.isCorrelation !== true
                        ) {
                            setArrayPoints((prevState) => [...prevState, item]);
                        }
                        return (
                            currentDate <= itemDate &&
                            itemDate < nextDate &&
                            item.isCorrelation !== true
                        );
                    })
                    .reduce((sum, item) => sum + item.value, 0);

                // Создаем новую дату на день позже
                const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

                // Проверяем, что valueDate не позже сегодняшней даты
                if (valueDate <= today) {
                    setArrayPoints((prevState) =>
                        prevState.map((item) => {
                            if (item.myID) {
                                return { ...item };
                            } else {
                                return {
                                    ...item,
                                    myID: valueDate.toISOString().split('T')[0],
                                };
                            }
                        })
                    );

                    result.push({
                        value: currentSum,
                        valueDate: valueDate.toISOString().split('T')[0],
                    });
                }

                currentDate = nextDate; // Переходим к следующей неделе
            }

            setReceivedPoints(
                result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
            );
        }
    };

    // Все для модального окна при смене отчетного дня
    const dayWeek = (day, type) => {
        if (type === 'reportDay') {
            switch (day) {
                case 0:
                    setShowReportDay('Воскресенье');
                    break;
                case 1:
                    setShowReportDay('Понедельник');
                    break;
                case 2:
                    setShowReportDay('Вторник');
                    break;
                case 3:
                    setShowReportDay('Среда');
                    break;
                case 4:
                    setShowReportDay('Четверг');
                    break;
                case 5:
                    setShowReportDay('Пятница');
                    break;
                case 6:
                    setShowReportDay('Суббота');
                    break;
                default:
                    break
            }
        } else {
            switch (day) {
                case 0:
                    setShowReportDayComes('Воскресенье');
                    break;
                case 1:
                    setShowReportDayComes('Понедельник');
                    break;
                case 2:
                    setShowReportDayComes('Вторник');
                    break;
                case 3:
                    setShowReportDayComes('Среда');
                    break;
                case 4:
                    setShowReportDayComes('Четверг');
                    break;
                case 5:
                    setShowReportDayComes('Пятница');
                    break;
                case 6:
                    setShowReportDayComes('Суббота');
                    break;
                default:
                    break
            }
        }
    };

    const save = () => {
        if (reportDay !== reportDayComes) {
            setOpenModalReportDay(true);
            dayWeek(reportDay, 'reportDay');
            dayWeek(reportDayComes, '');
        } else {
            saveUpdateStatistics();
        }
    };

    return (
        <div className={classes.wrapper}>
            <>
                <Header title={'редактировать Статистику'} onRightIcon={true} rightIcon={saveIcon} rightIconClick={save}>Личный Помощник</Header>
            </>
            {!openMenu && (
                <div className={classes.body}>
                    <>
                        <div className={classes.graph}>
                            <Graphic
                                data={[...receivedPoints, ...createPoints]}
                                name={
                                    name !== 'null'
                                        ? name
                                        : currentStatistic?.name
                                }
                                setName={setName}
                                typeGraphic={typeGraphic}
                                type={type}
                            >
                            </Graphic>
                        </div>
                        <div className={classes.arrowSection}>
                            <img
                                src={icon}
                                alt='icon'
                                style={{ transform: 'rotate(90deg)' }}
                                onClick={handleArrowLeftClick}
                            />
                            <select
                                value={typeGraphic}
                                onChange={(e) =>
                                    setTypeGraphic(e.target.value)
                                }
                            >
                                <option value='' disabled>
                                    Выберите тип отображения графика
                                </option>
                                <option value='Ежедневный'>
                                    {' '}
                                    Ежедневный (за один день)
                                </option>
                                <option value='Ежемесячный'>
                                    Ежемесячный (сумма за календарный месяц)
                                </option>
                                <option value='Ежегодовой'>
                                    Ежегодовой (сумма за календарный год)
                                </option>
                                <option value='13'>13 недель</option>
                                <option value='26'>26 недель</option>
                                <option value='52'>52 недели</option>
                            </select>
                            <img
                                src={icon}
                                alt='icon'
                                style={{ transform: 'rotate(-90deg)' }}
                                onClick={handleArrowRightClick}
                            />
                        </div>
                    </>
                </div>
            )}
            <div className={classes.menu}>
                <div className={classes.menuContent}>
                    <div className={classes.nameSection}>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Название статистики'
                        />
                        <img
                            src={arrowInCircle}
                            alt='icon'
                            onClick={() => setOpenMenu(!openMenu)}
                            style={{ transform: !openMenu ? 'rotate(270deg)' : 'rotate(90deg)' }}
                        />
                    </div>
                    {openMenu && (
                        <>
                            {/* <div className={classes.menuContainer}>
                                <div className={classes.name}
                                >
                                    Организация
                                </div>
                                <div className={classes.selectSection}>
                                    <select
                                        value={organizationId}
                                        onChange={(e) => setOrganizationId(e.target.value)}
                                        className={classes.select}
                                    >
                                        <option value='' disabled>
                                            Выберите организацию
                                        </option>
                                        {organizations?.map((item) => (
                                            <option value={item.id}>{item.organizationName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div> */}

                            <div className={classes.menuContainer}>
                                <div className={classes.name}
                                >
                                    Пост:
                                </div>
                                <div className={classes.selectSection}>
                                    <select
                                        value={
                                            postId !== 'null'
                                                ? postId
                                                : currentStatistic?.post?.id
                                        }
                                        onChange={(e) => {
                                            setPostId(e.target.value);
                                        }}
                                    >
                                        <option value='null' disabled>
                                            Выберите пост
                                        </option>
                                        {posts?.map((item) => {
                                            return (
                                                <option value={item.id}>
                                                    {item.postName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className={classes.menuContainer}>
                                <div className={classes.name}
                                >
                                    Тип графика:
                                </div>
                                <div className={classes.selectSection}>
                                    <select
                                        value={
                                            type !== 'null'
                                                ? type
                                                : currentStatistic.type
                                        } // Устанавливаем ID, по умолчанию пустая строка
                                        onChange={(e) => {
                                            setType(e.target.value);
                                        }}
                                    >
                                        <option value='null' disabled>
                                            Выберите тип
                                        </option>

                                        <option value='Прямая'>Прямая</option>
                                        <option value='Обратная'>Обратная</option>
                                    </select>
                                </div>
                            </div>
                            <div className={classes.tableContainer}>
                                <div className={classes.tableDots}>

                                    <div className={classes.tableButton}>
                                        <div
                                            onClick={addPoint}
                                            className={classes.addedBtn}
                                        >
                                            Добавить
                                        </div>
                                        <div
                                            onClick={deletePoint}
                                            className={classes.removeBtn}
                                        >
                                            Удалить
                                        </div>
                                    </div>

                                    {/* {points
                                    .sort(
                                        (a, b) =>
                                            Date.parse(b.valueDate) - Date.parse(a.valueDate)
                                    )
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className={classes.rowTableDtos}>
                                            <input
                                                type='date'
                                                value={item.valueDate} // привязка к текущему состоянию
                                                onChange={(e) => {
                                                    onChangePoints(
                                                        e.target.value,
                                                        'valueDate',
                                                        item.id
                                                    );
                                                }}
                                            />
                                            <input
                                                type='text'
                                                inputMode='numeric'
                                                style={{ borderLeft: '1px solid grey ' }}
                                                value={item.value} // привязка к текущему состоянию
                                                onChange={(e) => {
                                                    const newValue = e.target.value.replace(
                                                        /[^0-9]/g,
                                                        ''
                                                    );
                                                    onChangePoints(newValue, 'value', item.id);
                                                }}
                                            />
                                        </div>
                                    ))} */}

                                    {createPoints
                                        ?.sort(
                                            (a, b) =>
                                                Date.parse(b.valueDate) -
                                                Date.parse(a.valueDate)
                                        )
                                        ?.map((item, index) => {
                                            if (item.valueDate === '') {
                                                item.valueDate = new Date()
                                                    .toISOString()
                                                    .split('T')[0];
                                            }
                                            return (
                                                <div key={index} className={classes.rowTableDtos}>
                                                    <input
                                                        type='date'
                                                        value={item.valueDate}
                                                        onChange={(e) => {
                                                            onChangePoints(
                                                                '',
                                                                e.target.value,
                                                                'valueDate',
                                                                null,
                                                                item.id
                                                            );
                                                        }}
                                                    />
                                                    <input
                                                        type='text'
                                                        value={item.value}
                                                        inputMode='numeric'
                                                        placeholder='—'
                                                        onChange={(e) => {
                                                            const newValue =
                                                                e.target.value.replace(
                                                                    /[^0-9]/g,
                                                                    ''
                                                                );
                                                            onChangePoints(
                                                                '',
                                                                newValue,
                                                                'value',
                                                                null,
                                                                item.id
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}

                                    {receivedPoints?.map((item, index) => {
                                        if (typeGraphic === 'Ежедневный') {
                                            return (
                                                <div key={index} className={classes.rowTableDtos}>
                                                    <input
                                                        type='date'
                                                        value={item.valueDate}
                                                        onChange={(e) => {
                                                            onChangePoints(
                                                                'received',
                                                                e.target.value,
                                                                'valueDate',
                                                                index,
                                                                null
                                                            );
                                                        }}
                                                        disabled={disabledPoints}
                                                    />

                                                    <input
                                                        type='text'
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            const newValue =
                                                                e.target.value.replace(
                                                                    /[^0-9]/g,
                                                                    ''
                                                                );
                                                            onChangePoints(
                                                                'received',
                                                                newValue,
                                                                'value',
                                                                index,
                                                                null
                                                            );
                                                        }}
                                                        disabled={disabledPoints}
                                                    />
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={index}
                                                    className={`${classes.rowTableDtos}  ${classes.itemHover
                                                        }  ${activeIndex === index
                                                            ? classes.active
                                                            : ''
                                                        }`}
                                                    onClick={() => {
                                                        setActiveIndex(index);
                                                        showCurrentPoint(item.valueDate);
                                                    }}
                                                >
                                                    <div
                                                        disabled={disabledPoints}
                                                        style={{ borderRight: '1px solid grey ' }}
                                                    // className={`${classes.date} ${classes.textGrey}`}
                                                    >
                                                        {getDateFormatSatatistic(item.valueDate, typeGraphic)}
                                                    </div>

                                                    <div
                                                        // className={`${classes.number} ${classes.textGrey}`}
                                                        disabled={disabledPoints}
                                                    >
                                                        {item.value}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}

                                </div>
                            </div>
                            <div className={classes.menuContainer}>
                                <textarea
                                    placeholder='Описание статистики: что и как считать'
                                    value={
                                        description || currentStatistic.description
                                    }
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </textarea>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <HandlerMutation
                Loading={isLoadingUpdateStatisticMutation}
                Error={
                    isErrorUpdateStatisticMutation && !manualErrorReset
                } // Учитываем ручной сброс
                Success={
                    isSuccessUpdateStatisticMutation &&
                    !manualSuccessReset
                } // Учитываем ручной сброс
                textSuccess={"Статистика обновлена"}
                textError={
                    ErrorUpdateStatisticMutation?.data?.errors?.[0]?.errors?.[0]
                        ? ErrorUpdateStatisticMutation.data.errors[0].errors[0]
                        : ErrorUpdateStatisticMutation?.data?.message
                }
            ></HandlerMutation>
            {openModal && (
                <>
                    <div className={classes.modal}>
                        <table className={classes.modalTable}>
                            <div className={classes.tableHeader}>
                                {typeGraphic === "Ежемесячный" ||
                                    typeGraphic === "Ежегодовой" ? (
                                    <div className={classes.tableHeading}>
                                        <span>Значение за месяц</span>
                                    </div>
                                ) : (
                                    <div className=""></div>
                                )}

                                <div className={classes.iconSaveModal}>
                                    <img
                                        src={saveIcon}
                                        alt="Blacksavetmp"
                                        className={classes.image}
                                        onClick={() => {
                                            saveModalPoints(showPoints);
                                        }}
                                    />
                                </div>
                            </div>

                            <img
                                src={iconExit}
                                alt="exit"
                                onClick={exitModal}
                                className={classes.exitImage}
                            />

                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Значение</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {showPoints?.map((item) => (
                                            <div
                                                key={item.id}
                                                className={classes.row}
                                            >
                                                <span
                                                    className={`${classes.date} ${classes.textGrey}`}
                                                >
                                                    {getDateFormatSatatistic(item.valueDate, typeGraphic)}
                                                </span>
                                            </div>
                                        ))}
                                    </td>

                                    <td>
                                        {showPoints?.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className={classes.row}
                                            >
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="—"
                                                    value={item.value || ""}
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                ""
                                                            );
                                                        updateModalPoint(newValue, index);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}
