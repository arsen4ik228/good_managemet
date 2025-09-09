import React from 'react'
import classes from './LeftSider.module.css'
import logo from '@image/big_logo.svg'
import helper_icon from "@image/helper_icon.svg"
import CustomList from '../../../Custom/CustomList/CustomList'
import { useOrganizationHook, useGetReduxOrganization, usePostsHook } from '@hooks'
import { useDispatch } from 'react-redux'
import {
    setSelectedOrganizationId,
    setSelectedOrganizationReportDay,
} from "@slices";
import ListElem from '../../../Custom/CustomList/ListElem'
import { useNavigate } from 'react-router-dom'

export default function LeftSIder() {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const {
        organizations,
        isLoadingOrganization,
        isErrorOrganization
    } = useOrganizationHook();

    const { allChats, loadingAllChats, refetchAllChats } = usePostsHook()


    const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const handleOrganizationNameButtonClick = (id, name, reportDay) => {
        localStorage.setItem("selectedOrganizationId", id);
        localStorage.setItem("name", name);
        localStorage.setItem("reportDay", reportDay);
        dispatch(setSelectedOrganizationId(id));
        dispatch(setSelectedOrganizationReportDay(reportDay));
    };

    const handlerHelper = () => {
        navigate('helper')
    }

    const handlerCreateUser = () => {
        navigate('createUser')
    }


    console.log(allChats)

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <img src={logo} alt="GOODMANAGEMENT" onClick={() => navigate('accountSettings')}/>
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

                    <CustomList
                        title={'контакты'}
                        addButtonText={'Новый контакт'}
                        addButtonClick={handlerCreateUser}
                    >
                        <ListElem
                            icon={helper_icon}
                            linkSegment={'helper'}
                            upperText={'Гудменеджер'}
                            clickFunc={handlerHelper}
                        />

                        {allChats?.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    upperText={item.userFirstName + ' ' + item.userLastName}
                                    bottomText={item.postName}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>


                </div>
            </div>
        </>
    )
}
