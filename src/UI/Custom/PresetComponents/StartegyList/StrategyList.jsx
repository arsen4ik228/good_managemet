import React, { useState } from 'react'
import { useStrategyHook } from '../../../../hooks'
import CustomList from '../../CustomList/CustomList'
import { useLocation, useNavigate } from 'react-router-dom'
import ListElem from '../../CustomList/ListElem'
import draft_strategy from '@image/draft_strategy.svg'
import active_strategy from '@image/active_strategy.svg'
import finaly_strategy from '@image/finaly_strategy.svg'
import { baseUrl } from "@helpers/constants.js";

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

    const getIcon = (state) => {
        if(state === 'Завершена') return draft_strategy
        else if (state === 'Активная') return active_strategy
        else return finaly_strategy
    }

    console.log(activeAndDraftStrategies)

    return (
       <>
            <CustomList
                title={'Сотрудники'}
                isFilter={true}
                setOpenFilter={setOpenFilter}
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
                            upperText={`Стратегия №${item?.strategyNumber}`}
                            linkSegment={item.id}
                            // clickFunc={() => openUser(item.id)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
