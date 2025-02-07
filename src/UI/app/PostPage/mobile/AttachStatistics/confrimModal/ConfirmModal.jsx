import React from 'react'
import classes from "./ConfirmModal.module.css"
import close from '@Custom/SearchModal/icon/icon _ add.svg'

export default function ConfirmModal({ setModalOpen, requestFunc, selectedStatistics }) {

    const btnClick = () => {
        requestFunc()
        setModalOpen(false)
    } 

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.modalContainer}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} alt='close' />
                    </div>
                    <div className={classes.modalContent}>
                        <div className={classes.header}>
                            <span>
                                Статистики будут отвязаны от следующих постов:
                            </span>
                        </div>
                        <div className={classes.body}>
                            {selectedStatistics?.filter(item => item.hasOwnProperty('post'))
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className={classes.rowElement}
                                >
                                    <span>{item?.post?.name}:</span>
                                    <span>{item?.name}</span>
                                </div>
                            ))}
                        </div>
                        <footer className={classes.footer}>
                            <div className="">
                                <button
                                    onClick={() => btnClick()}
                                >
                                    Подтвердить
                                </button>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    )
}