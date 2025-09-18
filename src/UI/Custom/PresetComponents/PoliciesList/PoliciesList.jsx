import React, { useMemo, useState } from 'react'
import CustomList from '../../CustomList/CustomList'
import ListElem from '../../CustomList/ListElem'
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import { usePolicyHook } from '@hooks'
import icon_policy from '@image/poliycy_icon.svg'
import { useNavigate } from 'react-router-dom'


export default function PoliciesList() {

    const navigate = useNavigate()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()

    const {
        //Valera
        instructionsActive,
        instructionsDraft,
        instructionsCompleted,

        directivesActive,
        directivesDraft,
        directivesCompleted,

        disposalsActive,
        disposalsDraft,
        disposalsCompleted,

    } = usePolicyHook();

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

    return (
        <>
            <CustomList
                title={'Политики'}
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
            >
                <ListAddButtom textButton={'Создать политику'} clickFunc={() => console.log()} />

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

            </CustomList>
        </>
    )
}
