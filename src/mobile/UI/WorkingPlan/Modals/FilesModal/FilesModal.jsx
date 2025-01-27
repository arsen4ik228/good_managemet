import React from 'react'
import classes from './FilesModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'
import { usePolicyHook } from '../../../../hooks/usePolicyHook'

export default function FilesModal({ setOpenModal, policyId, setPolicyId, postOrganizationId }) {
    console.log('postOrganizationId   ',postOrganizationId)
    const {
        activeDirectives,
        activeInstructions,
    } = usePolicyHook({ organizationId: postOrganizationId })


    return (
        <ModalContainer
            setOpenModal={setOpenModal}
        >
            <>
                <div className={classes.content}>
                    <select className={classes.attachPolicy} name="attachPolicy" value={policyId} onChange={(e) => setPolicyId(e.target.value)}>
                        <option>Выберите политику</option>
                        {activeDirectives?.map((item, index) => (
                            <option key={index} value={item.id} >{item.policyName}</option>
                        ))}
                        {activeInstructions?.map((item, index) => (
                            <option key={index} value={item.id} >{item.policyName}</option>
                        ))}
                    </select>
                    <input type="file" />
                </div>
            </>
        </ModalContainer >
    )
}
