import React from 'react'
import "reactflow/dist/style.css";

import classes from "./MainCompany.module.css";
import Header from "@Custom/Header/Header";
import OrgChart from "./components/OrgChart";

import {useAllOrganizationsWithHighPost} from "../../../hooks/Organization/useAllOrganizationsWithHighPost.js";

export function MainCompany() {

    const {organizations, isLoadingOrganization, isErrorOrganization} =
        useAllOrganizationsWithHighPost();

    return (
        <div className={classes.dialog}>
            <Header name="структура компании" />
            <div className={classes.main}>
                <OrgChart data={organizations || []} />
            </div>
        </div>
    )
}
