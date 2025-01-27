import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './Main.module.css';
import menuIcon from './icon/icon _ menu.svg'
import { useGetOrganizationsQuery } from '../../BLL/organizationsApi';
import NavigationBar from '../Custom/NavigationBar/NavigationBar';
import Header from '../Custom/CustomHeader/Header';
const Main = () => {

    const navigate = useNavigate();
    const { userId } = useParams()
    const [selectedOrg, setSelectedOrg] = useState()


    const {
        organizations = []
    } = useGetOrganizationsQuery(userId, {
        selectFromResult: ({ data }) => ({
            organizations: data?.organizations || []
        })
    })

    const selectOrganization = (id) => {
        setSelectedOrg(id);
        if (typeof window !== 'undefined' && window.localStorage) {
            let savedId = window.localStorage.getItem('selectedOrganizationId');

            if (savedId && savedId === id.toString()) return

            window.localStorage.setItem('selectedOrganizationId', id.toString());
        }
    }

    const getStyles = useMemo(() => (id) => {
        if (id === selectedOrg) {
            return {
                'borderBottom': '1px solid #005475',
                'color': '#005475'
            };
        }
    }, [selectedOrg]);

    useEffect(() => {
        if (organizations.length > 0 && !selectedOrg)
            selectOrganization(organizations[0]?.id)

    }, [organizations])

    return (
        <div className={classes.wrapper}>
            <>
                <Header offLeftIcon={true}>Good Management</Header>
            </>
            <div className={classes.body}>
                <div className={classes.bodyColumn}>
                    {organizations?.map((item, index) => (
                        <div
                            key={index}
                            className={classes.orgElement}
                            onClick={() => selectOrganization(item?.id)}
                            style={getStyles(item.id)}
                        >
                            <span className={classes.bodyElementText}>{item.organizationName}</span>
                        </div>
                    ))}
                </div>
            </div>
            <footer className={classes.footer}>
                {/* <div className={classes.navigationContainer}>
                    <div className={classes.imgContainer}></div>
                    <div className={classes.imgContainer}></div>
                    <div className={classes.imgContainer}></div>
                </div> */}

                <NavigationBar></NavigationBar>
                {/* <div className={classes.inputRow}>
                    <div className={classes.inputElement}><input type="search" placeholder="Поиск" /></div>
                </div> */}
            </footer>
        </div>
    );
};

export default Main;