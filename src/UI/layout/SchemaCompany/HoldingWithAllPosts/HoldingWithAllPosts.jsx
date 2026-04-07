import React from 'react'
import "reactflow/dist/style.css";

import classes from "./HoldingWithPost.module.css";
import Header from "@Custom/Header/Header";
import OrgChart from "./components/OrgChart.jsx";

import { useAllOrganizationsWithAllPost,  } from "../../../../hooks/Organization/useAllOrganizationsWithAllPost.js";

export function HoldingWithAllPosts() {

    const { organizations, isLoadingOrganization, isErrorOrganization } =
        useAllOrganizationsWithAllPost();
    console.warn(organizations)
    return (
        <div className={classes.dialog}>
            <Header name="холдинг + все посты" />
            <div className={classes.main}>
                <OrgChart data={organizations || []} />
            </div>
        </div>
    )
}
