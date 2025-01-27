import React, { useState, useEffect } from 'react'
import classes from './NewStatistic.module.css'
import Header from '../Custom/Header/Header'
import icon from '../Custom/icon/icon _ downarrow _ 005475.svg'
import saveIcon from '../Custom/icon/icon _ save.svg'
import { resizeTextarea } from '../../BLL/constans'
import { useGetStatisticsNewQuery, usePostStatisticsMutation } from '../../BLL/statisticsApi'
import { useGetOrganizationsQuery } from '../../BLL/organizationsApi'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Graphic from '../Custom/Graph/Graphic'
import HandlerMutation from '../Custom/HandlerMutation'

export default function NewStatistic() {

    const [openMenu, setOpenMenu] = useState(true)

    const navigate = useNavigate();
    const { userId, paramPostID } = useParams();
    const back = () => {
        paramPostID ? navigate(`/${userId}/posts/${paramPostID}`) : navigate(`/${userId}/statistics`);
    };

    const [type, setType] = useState("");
    const [name, setName] = useState("Статистика");
    const [postId, setPostId] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState([
        { valueDate: new Date().toISOString().split('T')[0], value: 0, id: new Date() },
    ]);

    const [organization, setOrganization] = useState("");
    const [postsToOrganization, setPostsToOrganization] = useState([]);
    const [disabledPosts, setDisabledPosts] = useState(true);

    const dispatch = useDispatch();

    const {
        posts = [],
        isLoadingNewStatistic,
        isErrorNewStatistic,
    } = useGetStatisticsNewQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            posts: data?.posts || [],
            isLoadingNewStatistic: isLoading,
            isErrorNewStatistic: isError,
        }),
    });

    const {
        organizations = [],
        isLoadingOrganizations,
        isFetchingOrganizations,
        isErrorOrganizations,
    } = useGetOrganizationsQuery(userId, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            organizations: data?.transformOrganizations || [],
            isLoadingOrganizations: isLoading,
            isFetchingOrganizations: isFetching,
            isErrorOrganizations: isError,
        }),
    });

    const [
        postStatistics,
        {
            isLoading: isLoadingPostStatisticMutation,
            isSuccess: isSuccessPostStatisticMutation,
            isError: isErrorPostStatisticMutation,
            error: Error,
        },
    ] = usePostStatisticsMutation();

    // Для создания статистики через страницу пост
    useEffect(() => {
        if (paramPostID && posts.length>0 && !postId) {
            console.log(paramPostID)
            const obj = posts.find((item) => item.id === paramPostID);
            console.log(obj)
            setOrganization(obj?.organization.id);
            setPostId(paramPostID);
        }
    }, [posts,paramPostID]);
    // Конец

    useEffect(() => {
        if (organization !== "") {
            const array = posts.filter(
                (item) => item?.organization?.id === organization
            );
            setPostsToOrganization(array);
            setDisabledPosts(false);
        }
    }, [organization]);

    const addPoint = () => {
        setPoints((prevState) => [
            { valueDate: "", value: 0, id: new Date() },
            ...prevState,
        ]);
    };

    const deletePoint = () => {
        setPoints((prevState) => prevState.slice(0, -1));
    };

    const onChangePoints = (value, type, id) => {
        setPoints((prevPoints) => {
            const updatedPoints = prevPoints.map((item) => {
                if (item.id === id) {
                    return type === "value"
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
    };

    const reset = () => {
        setType("");
        setName("");
        setPostId("");
        setDescription("");
        setPoints([]);
        setOrganization("");
    };

    // const createStatisticNavigate = (id) => {
    //   dispatch(setStatisticCreatedId(id));
    //   navigate(`/${userId}/statistics`);
    // };

    const saveStatistics = async () => {
        const formatDate = points.map((item) => {
            return {
                value: item.value,
                valueDate: new Date(item.valueDate),
                isCorrelation: false,
            };
        });
        const Data = [];

        if (description !== "") {
            Data.description = description;
        }
        await postStatistics({
            userId,
            type: type,
            name: name,
            ...Data,
            postId: postId,
            statisticDataCreateDtos: formatDate,
        })
            .unwrap()
            .then((result) => {
                reset();
                //   createStatisticNavigate(result.id);
                navigate(`/${userId}/Statistics/${result?.id}`)

            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <Header create={false} title={'Cоздать Статистику'}></Header>
                <div className={classes.saveIcon} onClick={() => saveStatistics()}>
                    <img src={saveIcon} alt="" />
                </div>
            </div>
            {!openMenu && (
                <div className={classes.body}>
                    <>
                        <div className={classes.graph}>
                            <Graphic
                                data={points}
                                name={name}
                                setName={setName}
                                type={type}
                            ></Graphic>
                        </div>
                        {/* <div className={classes.arrowSection}>
                            <img
                                src={icon}
                                style={{ transform: 'rotate(90deg)' }}
                            />
                            <select name="" id="">
                                <option value="">Ежегодный</option>
                            </select>
                            <img
                                src={icon}
                                style={{ transform: 'rotate(-90deg)' }}
                            />
                        </div> */}
                    </>
                </div>
            )}
            <div className={classes.menu}>
                <div className={classes.menuContent}>
                    <div className={classes.nameSection}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Название статистики"
                        />
                        <img
                            src={icon}
                            alt="icon"
                            onClick={() => setOpenMenu(!openMenu)}
                            style={{ transform: !openMenu ? 'rotate(180deg)' : 'none' }}
                        />
                    </div>
                    {openMenu && (
                        <>
                            <div className={classes.menuContainer}>
                                <div className={classes.name}
                                >
                                    Организация
                                </div>
                                <div className={classes.selectSection}>
                                    <select
                                        value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                        className={classes.element}
                                    >
                                        <option value="" disabled>
                                            Выберите организацию
                                        </option>
                                        {organizations?.map((item) => (
                                            <option value={item.id}>{item.organizationName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={classes.menuContainer}>
                                <div className={classes.name}
                                >
                                    Пост:
                                </div>
                                <div className={classes.selectSection}>
                                    <select
                                        value={postId} // Устанавливаем ID, по умолчанию пустая строка
                                        onChange={(e) => {
                                            setPostId(e.target.value);
                                        }}
                                        disabled={disabledPosts}
                                    >
                                        <option value="" disabled>
                                            Выберите пост
                                        </option>
                                        {postsToOrganization.map((item) => {
                                            return <option value={item.id}>{item.postName}</option>;
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
                                        value={type} // Устанавливаем ID, по умолчанию пустая строка
                                        onChange={(e) => {
                                            setType(e.target.value);
                                        }}
                                    >
                                        <option value="" disabled>
                                            Выберите тип
                                        </option>

                                        <option value="Прямая">Прямая</option>
                                        <option value="Обратная">Обратная</option>
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

                                    {points
                                        .sort(
                                            (a, b) =>
                                                Date.parse(b.valueDate) - Date.parse(a.valueDate)
                                        )
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className={classes.rowTableDtos}>
                                                <input
                                                    type="date"
                                                    value={item.valueDate} // привязка к текущему состоянию
                                                    onChange={(e) => {
                                                        onChangePoints(
                                                            e.target.value,
                                                            "valueDate",
                                                            item.id
                                                        );
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    style={{ borderLeft: '1px solid grey ' }}
                                                    value={item.value} // привязка к текущему состоянию
                                                    onChange={(e) => {
                                                        const newValue = e.target.value.replace(
                                                            /[^0-9]/g,
                                                            ""
                                                        );
                                                        onChangePoints(newValue, "value", item.id);
                                                    }}
                                                />
                                            </div>
                                        ))}

                                </div>
                            </div>
                            <div className={classes.menuContainer}>
                                <textarea
                                    placeholder="Описание статистики: что и как считать"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <HandlerMutation
                Loading={isLoadingPostStatisticMutation}
                Error={isErrorPostStatisticMutation}
                Success={isSuccessPostStatisticMutation}
                textSuccess={"Подборка политик успешко создана"}
                textError={Error?.data?.errors[0]?.errors}
            >
            </HandlerMutation>
        </div>
    )
}
