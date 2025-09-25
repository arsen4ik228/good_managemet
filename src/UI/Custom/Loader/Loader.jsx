import React, { useState, useEffect } from 'react'
import classes from "./Loader.module.css";
import icon from "../../image/iconHeader.svg";

export default function Loader() {
    const [progress, setProgress] = useState(5);

    useEffect(() => {
        let interval;

        interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return 90;
                return prev + 4;
            });
        }, 40);


        return () => clearInterval(interval);
    }, []);

    return (
        <div className={classes.load}>
            <div className={classes.loadContent}>
                <img src={icon} alt="Loading..." className={classes.loadImage} />
                <div className={classes.progressContainer}>
                    <div
                        className={classes.progressBar}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}
