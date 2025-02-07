import React, { useEffect, useState } from 'react'
import classes from "./ModalChangeReportDay.module.css"
import close from '../../Custom/SearchModal/icon/icon _ add.svg'
import { useUpdateOrganizationsMutation } from '@services';
import {useGetReduxOrganization} from '@hooks';

export default function ModalChangeReportDay({ setModalOpen, parenReportDay }) {

    const [reportDay, setReportDay] = useState(parenReportDay)

    const { reduxSelectedOrganizationId } = useGetReduxOrganization()

    useEffect(() => {
        setReportDay(parenReportDay)
    }, [parenReportDay])

    console.log(reportDay)

    const [
        updateOrganization,
        {
            isLoading: isLoadingUpdateOrganizationMutation,
            isSuccess: isSuccessUpdateOrganizationMutation,
            isError: isErrorUpdateOrganizationMutation,
            error: ErrorOrganization,
        },
    ] = useUpdateOrganizationsMutation();

    const saveUpdateOrganization = async () => {
        await updateOrganization({
            _id: reduxSelectedOrganizationId,
            reportDay: +reportDay,
        })
            .unwrap()
            .then(() => {
                setModalOpen(false);
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.modalContainer}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.modalContent}>
                        <span>
                            Отчётный день:
                        </span>
                        <select
                            value={reportDay}
                            onChange={(e) => setReportDay(e.target.value)}
                        >
                            <option value={1}>Пн</option>
                            <option value={2}>Вт</option>
                            <option value={3}>Ср</option>
                            <option value={4}>Чт</option>
                            <option value={5}>Пт</option>
                            <option value={6}>Сб</option>
                            <option value={0}>Вс</option>
                        </select>
                    </div>

                    <div className={classes.buttonContainer}>
                        <button
                            onClick={() => saveUpdateOrganization()}
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
