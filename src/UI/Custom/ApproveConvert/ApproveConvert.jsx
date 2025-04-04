import React, { useState } from 'react';
import classes from './ApproveConvert.module.css';
import { useConvertsHook } from '@hooks';

export default function ApproveConvert({ setRequestFunction }) {
    const [activeButton, setActiveButton] = useState(null);


    const handleClick = (status) => {
        setActiveButton(status)

        setRequestFunction(status === 'approve' ? 'approve' : 'cancel')
    }

    return (
        <div className={classes.wrapper}>
            <div>Согласовать приказ?</div>
            <div className={classes.content}>
                <button
                    className={`${classes.button} ${activeButton === 'approve' ? classes.buttonActive : ''}`}
                    onClick={() => handleClick('approve')}
                >
                    Согласовать
                </button>
                <button
                    className={`${classes.button} ${activeButton === 'cancel' ? classes.buttonActive : ''}`}
                    onClick={() => handleClick('cancel')}
                >
                    Отменить
                </button>
            </div>
        </div>
    );
}