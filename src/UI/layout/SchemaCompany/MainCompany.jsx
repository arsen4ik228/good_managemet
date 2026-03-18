import React from 'react'
import "reactflow/dist/style.css";

import classes from "./MainCompany.module.css";
import Header from "@Custom/Header/Header";
import {useAllOrganizations} from "@hooks/Organization/useAllOrganizations.js";
import OrgChart from "./components/OrgChart";

export function MainCompany() {

    const {organizations, isLoadingOrganization, isErrorOrganization} =
        useAllOrganizations();

    return (
        <div className={classes.dialog}>
            <Header name="структура компании" />
            <div className={classes.main}>
                <OrgChart data={organizations || []} />
            </div>
        </div>
    )
}
