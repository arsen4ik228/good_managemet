import React from "react";
import classes from './ButtomContainer.module.css'


export const ButtonContainer = ({ children, clickFunction, disabled }) => {

    const buttonStyle = disabled 
    ? { backgroundColor: "#00000040", }
    : {};


    const handleClick = () => {
        if (clickFunction && !disabled) {
            clickFunction();
        }
    };

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.buttonContainer}>
                    <button
                        disabled={disabled}
                        onClick={() => handleClick()}
                        style={buttonStyle}
                    >
                        {children}
                    </button>
                </div>
            </div>
        </>
    )
}