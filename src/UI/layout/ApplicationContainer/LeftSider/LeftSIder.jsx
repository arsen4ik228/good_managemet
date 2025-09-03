import React from 'react'
import classes from './LeftSider.module.css'
import logo from '@image/big_logo.svg'
import CustomList from '../../../Custom/CustomList/CustomList'
import { useOrganizationHook, useGetReduxOrganization } from '@hooks'
import { useDispatch } from 'react-redux'
import {
    setSelectedOrganizationId,
    setSelectedOrganizationReportDay,
} from "@slices";
import ListElem from '../../../Custom/CustomList/ListElem'

export default function LeftSIder() {

    const dispatch = useDispatch();

    const {
        organizations,
        isLoadingOrganization,
        isErrorOrganization
    } = useOrganizationHook();

    const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const handleOrganizationNameButtonClick = (id, name, reportDay) => {
        localStorage.setItem("selectedOrganizationId", id);
        localStorage.setItem("name", name);
        localStorage.setItem("reportDay", reportDay);
        dispatch(setSelectedOrganizationId(id));
        dispatch(setSelectedOrganizationReportDay(reportDay));
    };


    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <img src={logo} alt="GOODMANAGEMENT" />
                    <div>GOODMANAGEMENT</div>
                </div>
                <div className={classes.content}>

                    <CustomList
                        title={'организации'}
                        addButtonText={'Новая организация'}
                    >
                        {organizations.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    upperText={item.organizationName}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>


                </div>
            </div>
        </>
    )
}
