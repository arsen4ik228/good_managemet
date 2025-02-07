import React, { useEffect, useState } from 'react'
import classes from './ConfirmCompleteModal.module.css'
import close from "../SearchModal/icon/icon _ add.svg";

export default function ConfirmCompleteModal({ setTargetState, setOpenModal, item }) {

    const [targetIsProduct, setTargetIsProduct] = useState(false)

    useEffect(() => {
        if (item?.type === 'Продукт') {
            setTargetIsProduct(true)
        }
    }, [item])

    const buttonClick = (flag) => {
        console.log('clich change state')
        setTargetState('Завершена')
        setOpenModal(false)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setOpenModal(false)}>
                        <img src={close} alt='close'/>
                    </div>
                    {targetIsProduct ? (
                        <div className={classes.title}>Данное действие <span>нельзя отменить</span>, завершить проект?</div>

                    ) : (
                        <div className={classes.title}>Данное действие <span>нельзя отменить</span>, завершить задачу?</div>
                    )}

                    <div className={classes.btn}>
                        <button onClick={() => buttonClick(targetIsProduct)}> Завершить</button>
                    </div>
                </div>
            </div >
        </>
    )
}
