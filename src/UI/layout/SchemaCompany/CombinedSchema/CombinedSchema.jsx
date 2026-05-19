import React, {useEffect} from 'react';
import "reactflow/dist/style.css";
import classes from './CombinedSchema.module.css';
import Header from "@Custom/Header/Header";
import OrgChart from "./components/OrgChart.jsx";
import { useAllOrganizationsWithAllPost } from "../../../../hooks/Organization/useAllOrganizationsWithAllPost.js";

export function CombinedSchema() {
    const { organizations, isLoadingOrganization, isErrorOrganization } = useAllOrganizationsWithAllPost();

    useEffect(() => {
        document.title = 'Структура компании';
    }, []);
    return (
        <div className={classes.dialog}>
            <Header name="структура компании" />
            <div className={classes.main}>
                <OrgChart
                    data={organizations || []}
                    isLoading={isLoadingOrganization}
                    isError={isErrorOrganization}
                />
            </div>
        </div>
    );
}
