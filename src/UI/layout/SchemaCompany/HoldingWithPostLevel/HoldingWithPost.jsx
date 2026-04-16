import React from 'react'
import "reactflow/dist/style.css";

import classes from "./HoldingWithPost.module.css";
import Header from "@Custom/Header/Header";
import OrgChart from "./components/OrgChart.jsx";

import { useAllOrganizationsWithHighPost,  } from "../../../../hooks/Organization/useAllOrganizationsWithHighPost.js";

export function HoldingWithPost() {

    const { organizations, isLoadingOrganization, isErrorOrganization } =
        useAllOrganizationsWithHighPost();
    console.warn(organizations)
    return (
        <div className={classes.dialog}>
            <Header name="холдинг + посты" />
            <div className={classes.main}>
                <OrgChart data={organizations || []} />
            </div>
        </div>
    )
}
