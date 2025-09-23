import React, { useEffect, useMemo, useState } from 'react'
import classes from './LeftSider.module.css'
import logo from '@image/big_logo.svg'
import helper_icon from "@image/helper_icon.svg"
import org_icon from '@image/org_icon.svg'
import CustomList from '../../../Custom/CustomList/CustomList'
import { useOrganizationHook, useGetReduxOrganization, usePostsHook, useRightPanel } from '@hooks'
import { useDispatch } from 'react-redux'
import {
    setSelectedOrganizationId,
    setSelectedOrganizationReportDay,
} from "@slices";
import ListElem from '../../../Custom/CustomList/ListElem'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '@helpers/constants'

export default function LeftSIder() {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { updatePanelProps } = useRightPanel()

    const [seacrhOrganizationsSectionsValue, setSearchOrganizationsSectionsValue] = useState()
    const [searchContactsSectionsValue, setContactSectionsValue] = useState()
    const [selectedOrgSectionValue, setSelectedOrgSectionValue] = useState()
    const [selectedContactsSectionValue, setSelectedContactsSectionsValue] = useState()

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
        navigate(`/${id}`)
    };

    const handlerHelper = () => {
        navigate('helper')
    }

    const handlerCreateUser = () => {
        navigate('createUser')
    }

    const handlerContact = (item) => {

        updatePanelProps(
            {
                name: `${item.userFirstName} ${item.userLastName}`,
                // avatar: baseUrl + item.avatarUrl
            }
        )

        navigate(`chat/${item.userId}`)
    }

    const filtredOrganizations = useMemo(() => {
        if (!seacrhOrganizationsSectionsValue?.trim()) {
            return organizations; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhOrganizationsSectionsValue?.toLowerCase();
        return organizations.filter(item =>
            item.organizationName.toLowerCase().includes(searchLower)
        );
    }, [seacrhOrganizationsSectionsValue, organizations]);

    const filtredContacts = useMemo(() => {
        if (!searchContactsSectionsValue?.trim()) {
            return allChats; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = searchContactsSectionsValue?.toLowerCase();
        return allChats.filter(item =>
            item.userFirstName.toLowerCase().includes(searchLower) ||
            item.userLastName.toLowerCase().includes(searchLower) ||
            item.postName.toLowerCase().includes(searchLower)
        );
    }, [searchContactsSectionsValue, allChats]);

    useEffect(() => {
        if (
            !isLoadingOrganization &&
            !isErrorOrganization &&
            organizations?.length > 0
        ) {
            const defaultOrg = organizations[0];
            if (!localStorage.getItem("selectedOrganizationId")) {
                localStorage.setItem("selectedOrganizationId", defaultOrg.id);
                localStorage.setItem("name", defaultOrg.organizationName);
                localStorage.setItem("reportDay", defaultOrg.reportDay);

                // Также обновляем Redux store
                dispatch(setSelectedOrganizationId(defaultOrg.id));
                dispatch(setSelectedOrganizationReportDay(defaultOrg.reportDay));

                // navigate(`/${defaultOrg.id}`)
            }

            navigate(`/${defaultOrg.id}`)

        }
    }, [organizations, isLoadingOrganization, isErrorOrganization]);

    console.log('filtredContacts   ', filtredContacts)
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <img src={logo} alt="GOODMANAGEMENT" onClick={() => navigate('accountSettings')} />
                    <div>GOODMANAGEMENT</div>
                </div>
                <div className={classes.content}>

                    <CustomList
                        title={'организации'}
                        addButtonText={'Новая организация'}
                        searchValue={seacrhOrganizationsSectionsValue}
                        searchFunc={setSearchOrganizationsSectionsValue}
                        selectedItem={selectedOrgSectionValue}
                        expanded={false}
                    >
                        {filtredOrganizations.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    icon={org_icon}
                                    upperText={item.organizationName}
                                    linkSegment={item.id}
                                    setSelectedItemData={setSelectedOrgSectionValue}
                                    clickFunc={() =>
                                        handleOrganizationNameButtonClick(
                                            item.id,
                                            item.organizationName,
                                            item.reportDay
                                        )}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>

                    <CustomList
                        title={'контакты'}
                        addButtonText={'Новый контакт'}
                        addButtonClick={handlerCreateUser}
                        searchValue={searchContactsSectionsValue}
                        searchFunc={setContactSectionsValue}
                        selectedItem={selectedContactsSectionValue}
                    >
                        <ListElem
                            icon={helper_icon}
                            linkSegment={'helper'}
                            upperText={'Гудменеджер'}
                            bottomText={'ИИ Помощник'}
                            clickFunc={handlerHelper}
                        />

                        {filtredContacts?.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    upperText={item.userFirstName + ' ' + item.userLastName}
                                    bottomText={item.postName}
                                    linkSegment={`${item.userId}`}
                                    clickFunc={() => handlerContact(item)}
                                    setSelectedItemData={setSelectedContactsSectionsValue}
                                    bage={calculateUnseenMessages(item)}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>


                </div>
            </div>
        </>
    )
}


const calculateUnseenMessages = (item, socketMessagesCount) => {

    if (!socketMessagesCount) {
        return (
            (+item.unseenMessagesCount || 0) +
            (+item.watcherUnseenCount || 0) 
            // (+(socketMessagesCount.get(item.id)) || 0)
        );
    }

    if (!item?.unseenMessagesCount) return null;

    return (
        (+item.unseenMessagesCount || 0) +
        (+item.watcherUnseenCount || 0) +
        (+(socketMessagesCount.get(item.id)) || 0)
    );
};