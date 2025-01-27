import React from 'react';
import classes from "./Header.module.css";
import backRow from "../icon/icon _ back.svg";
import add from "../icon/icon _ add _ blue.svg";
import { useNavigate } from "react-router-dom";

function Header({ title, create }) {

    const navigate = useNavigate();

    const addNew = () => {
        navigate('new')
    }

    return (
        <>
            <div className={classes.headContainer}>
                <div className={classes.headRow}>
                    <div className={classes.blueLine}></div>
                    <div className={classes.whiteLine}>
                        <div className={classes.headElem}>
                            <div className={classes.icon}>
                                <img src={backRow} alt="icon" onClick={() => navigate(-1)} />
                            </div>
                            <div className={classes.txt}>
                                <div className={classes.headText}>Личный помощник</div>
                                <div className={classes.sectionName}>{title}</div>
                            </div>

                        </div>

                        <div className={classes.menu}>
                            {create &&
                                <img
                                    src={add}
                                    alt="add"
                                    onClick={() => addNew()}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;