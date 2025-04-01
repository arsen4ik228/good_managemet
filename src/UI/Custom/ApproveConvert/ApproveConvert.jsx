import React, { useState } from 'react';
import classes from './ApproveConvert.module.css';

export default function ApproveConvert() {
    const [activeButton, setActiveButton] = useState(null);

    return (
        <div className={classes.wrapper}>
            <div>Согласовать приказ?</div>
            <div className={classes.content}>
                <button 
                    className={`${classes.button} ${activeButton === 'approve' ? 'active' : ''}`}
                    onClick={() => setActiveButton('approve')}
                >
                    Согласовать
                </button>
                <button 
                    className={`${classes.button} ${activeButton === 'cancel' ? 'active' : ''}`}
                    onClick={() => setActiveButton('cancel')}
                >
                    Отменить
                </button>
            </div>
        </div>
    );
}