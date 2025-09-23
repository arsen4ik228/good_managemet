import React, { useMemo, useState, useEffect } from 'react'
import CustomList from '../../CustomList/CustomList'
import ListElem from '../../CustomList/ListElem'
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import { useGetAllPolicy } from '@hooks'
import icon_policy from '@image/poliycy_icon.svg'
import { useNavigate } from 'react-router-dom'
import ModalCreatePolicy from '../../../layout/Policies/ModalCreatePolicy';


export default function PoliciesList() {

    const navigate = useNavigate()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()
    const [openCreatePolicy, setOpenCreatePolicy] = useState(false);

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

        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies,

    } = useGetAllPolicy();

    const array = instructionsActive
        .concat(directivesActive)
        .concat(disposalsActive);


    const filtredPolicies = useMemo(() => {
        if (!seacrhPostsSectionsValue?.trim()) {
            return instructionsActive; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhPostsSectionsValue?.toLowerCase();
        return instructionsActive.filter(item =>
            item.postName.toLowerCase().includes(searchLower)
        );
    }, [seacrhPostsSectionsValue, array]);


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
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
            >
                <ListAddButtom textButton={'Создать политику'} clickFunc={() => setOpenCreatePolicy(true)} />

                {filtredPolicies.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={icon_policy}
                            upperText={item.policyName}
                            linkSegment={item.id}
                            clickFunc={() => openPolicy(item.id)}
                        />
                    </React.Fragment>
                ))}

                <ModalCreatePolicy
                    open={openCreatePolicy}
                    setOpen={setOpenCreatePolicy} />

            </CustomList>
        </>
    )
}
