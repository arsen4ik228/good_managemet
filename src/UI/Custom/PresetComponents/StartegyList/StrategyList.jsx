import React, { useState } from 'react'
import { useCreatePost, useGetReduxOrganization, useStrategyHook } from '../../../../hooks'
import CustomList from '../../CustomList/CustomList'
import { useLocation, useNavigate } from 'react-router-dom'
import ListElem from '../../CustomList/ListElem'
import draft_strategy from '@image/draft_strategy.svg'
import active_strategy from '@image/active_strategy.svg'
import finaly_strategy from '@image/finaly_strategy.svg'
import { baseUrl } from "@helpers/constants.js";
import { useCreateStrategy } from '../../../../hooks/Strategy/useCreateStrategy'
import { message } from 'antd';

export default function StrategyList() {

    const navigate = useNavigate()
    const location = useLocation()
    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()

    const [isActive, setIsActive] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);

    const {
        activeAndDraftStrategies,
        archiveStrategies,
        activeStrategyId,
        hasDraftStrategies,
        isLoadingStrategies,
        isErrorStrategies
    } = useStrategyHook()

    const { reduxSelectedOrganizationId } = useGetReduxOrganization()

    const { postStrategy } = useCreateStrategy()

    const getIcon = (state) => {
        if (state === 'Завершена') return draft_strategy
        else if (state === 'Активная') return active_strategy
        else return finaly_strategy
    }

    const openStrategy = (id) => {
        navigate(`helper/strategy/${id}`)
    }



    const savePostStarteg = async () => {
        await postStrategy({
            content: " ",
            organizationId: reduxSelectedOrganizationId,
        })
            .unwrap()
            .then((result) => {
                // setPostId(result.id);
            })
            .catch((error) => {
                message.error(error.data.message || 'Произошла ошибка');
            });
    };

    console.log(activeAndDraftStrategies)

    return (
        <>
            <CustomList
                title={'Cтратегии'}
                addButtonClick={() => savePostStarteg()}
                addButtonText={'Создать стратегию'}
            // searchValue={seacrhUsersSectionsValue}
            // searchFunc={setSeacrhUsersSectionsValue}
            >

                {/* {
                    openFilter && <FilterElement
                        array={arrayFilter}
                        state={isActive}
                        setState={setIsActive}
                        setOpenFilter={setOpenFilter}
                    />
                } */}

                {activeAndDraftStrategies.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={getIcon()}
                            upperText={`№${item?.strategyNumber}`}
                            linkSegment={item.id}
                            clickFunc={() => openStrategy(item.id)}
                        />
                    </React.Fragment>
                ))}

                {archiveStrategies.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={getIcon()}
                            upperText={`№${item?.strategyNumber}`}
                            linkSegment={item.id}
                            clickFunc={() => openStrategy(item.id)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
