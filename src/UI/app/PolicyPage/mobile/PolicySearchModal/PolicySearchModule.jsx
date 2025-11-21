import React, { useEffect } from 'react';
import classes from "./PolicySearchModal.module.css";
import close from "../../Custom/SearchModal/icon/icon _ add.svg";
import { useGetPolicyDirectoriesQuery } from '../../../BLL/policyDirectoriesApi';
import { useParams } from 'react-router-dom';

function PolicySearchModule({ setSelectedId, setModalOpen, firstArray, firstTitle, secondArray, secondTitle, componentName }) {

    const { userId } = useParams()
    const [openFirst, setOpenFirst] = React.useState(false);
    const [openSecond, setOpenSecond] = React.useState(false);

    const {
        data = [],
        isLoadingNewSpeedGoal,
        isErrorNewSpeedGoal,
    } = useGetPolicyDirectoriesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            data: data || [],
            isLoadingNewSpeedGoal: isLoading,
            isErrorNewSpeedGoal: isError,
        }),
    });
    //(data)
    useEffect(() => {
        
    }, [])

    const handleArrayItems = (items) => {
        return (
            <>
                {items.map((item, index) => (
                    <div key={index} className={classes.item} onClick={() => clickPolicyId(item.id)}>
                        {item[`${componentName}`]}
                    </div>
                ))}
            </>
        );
    };

    const openListFirst = () => {
        openFirst ? setOpenFirst(false) : setOpenFirst(true);
    }
    const openListSecond = () => {
        openSecond ? setOpenSecond(false) : setOpenSecond(true);
    }
    const clickPolicyId = (id) => {
        setSelectedId(id)
        setModalOpen(false);
    }
    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.element_srch}>

                        <input type="search" placeholder="Поиск" />
                    </div>
                    <div className={classes.element_var}>
                        <div className={classes.heading} onClick={openListFirst}>{firstTitle}</div>
                        {openFirst && handleArrayItems(firstArray)}

                        {secondArray && (
                            <>
                                <div className={classes.heading} onClick={openListSecond}>{secondTitle}</div>
                                {openSecond && handleArrayItems(secondArray)}
                            </>
                        )}
                        {data && (
                            <>
                                {data.map((item, index) => (
                                    <>
                                        <div className={classes.heading} style={{ 'background': 'none' }}> {item.directoryName} </div>
                                        {item.policyToPolicyDirectories?.map((element, index1) => (
                                            <div key={index1} className={classes.item} onClick={() => clickPolicyId(element.policy.id)}>
                                                {element.policy.policyName}
                                            </div>
                                        ))}
                                    </>

                                ))}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default PolicySearchModule;