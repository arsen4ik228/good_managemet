import React from 'react';
import classes from "./AlertSavePost.module.css";
import close from "../SearchModal/icon/icon _ add.svg";

function AlertSavePost({ requestFunc, setModalOpen}) {

    const btnClick = () => {
        requestFunc()
        setModalOpen(false)
    }

    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.text}>
                        Чтобы прикрепить Статистику сохраните Пост!
                    </div>

                    <footer className={classes.footer}>
                        <button onClick={() => btnClick()}>Сохранить</button>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default AlertSavePost;