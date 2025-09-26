
import React, { useEffect, useMemo, useState } from 'react'
import CustomList from '../../CustomList/CustomList'
import FilterElement from '../../CustomList/FilterElement'
import PoliciesMenu from './PoliciesMenu'
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import { useGetAllPolicy } from '@hooks'

import { notEmpty } from '@helpers/helpers'
import { useLocation, useNavigate } from 'react-router-dom'
import ModalCreatePolicy from '../../../layout/Policies/ModalCreatePolicy';



const arrayFilter = [
    {
        label: "Черновики",
        value: "draft"
    },
    {
        label: "Активные",
        value: "active"
    },
    {
        label: "Архивные",
        value: "completed"
    }
]

export default function PoliciesList() {

    const navigate = useNavigate()
    const location = useLocation()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()
    const [openCreatePolicy, setOpenCreatePolicy] = useState(false);
    const [statePolicy, setStatePolicy] = useState("active");
    const [openFilter, setOpenFilter] = useState(false);

    const {
        refetch,

        instructionsActive,
        instructionsDraft,
        instructionsCompleted,

        directivesActive,
        directivesDraft,
        directivesCompleted,

        disposalsActive,
        disposalsDraft,
        disposalsCompleted,

    } = useGetAllPolicy();

    const arrayActive = instructionsActive
        .concat(directivesActive)
        .concat(disposalsActive);


    const arrayDraft = instructionsDraft
        .concat(directivesDraft)
        .concat(disposalsDraft);


    const arrayCompleted = instructionsCompleted
        .concat(directivesCompleted)
        .concat(disposalsCompleted);


    const objAllPolicies = useMemo(() => ({
        active: arrayActive,
        draft: arrayDraft,
        completed: arrayCompleted
    }), [arrayActive, arrayDraft, arrayCompleted]);


    useEffect(() => {

        if (!notEmpty(directivesActive)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'policy') return;

        navigate(`helper/policy/${directivesActive[0]?.id}`)
    }, [directivesActive])


    const openPolicy = (id) => {
        navigate(`helper/policy/${id}`);
    }


    useEffect(() => {
        const channel = new BroadcastChannel("policyName_channel");

        const handler = (event) => {
            if (event.data === "name") {
                refetch();
            }
        };

        channel.addEventListener("message", handler);

        return () => {
            channel.removeEventListener("message", handler);
            channel.close();
        };
    }, [refetch]);

    return (
        <>
            <CustomList
                title={'Политики'}
                isFilter={true}
                setOpenFilter={setOpenFilter}
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
            >

                {
                    openFilter && <FilterElement
                        array={arrayFilter}
                        state={statePolicy}
                        setState={setStatePolicy}
                        setOpenFilter={setOpenFilter}
                    />
                }


                <ListAddButtom textButton={'Создать политику'} clickFunc={() => setOpenCreatePolicy(true)} />


                <PoliciesMenu
                    objAllPolicies={objAllPolicies}
                    statePolicy={statePolicy}
                    openPolicy={openPolicy}
                    seacrhPostsSectionsValue={seacrhPostsSectionsValue}
                />

                <ModalCreatePolicy
                    open={openCreatePolicy}
                    setOpen={setOpenCreatePolicy} />

            </CustomList >
        </>
    )
}
