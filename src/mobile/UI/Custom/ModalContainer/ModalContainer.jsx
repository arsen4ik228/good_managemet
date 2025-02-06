import React from 'react'
import classes from './ModalContainer.module.css'
import { ButtonContainer } from '../CustomButtomContainer/ButtonContainer'
import close from "../SearchModal/icon/icon _ add.svg";
import { isMobile } from 'react-device-detect';
import exitModal from "@image/exitModal.svg";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";


export default function ModalContainer({ children, buttonText, setOpenModal, clickFunction, disabledButton }) {

    const closeModal = () => {
        setOpenModal(false)
    }
    return (
        <>
            <div className={classes.wrapper}>
                <div 
                className={classes.contentContainer}
                style={{'left' : isMobile ? '0' : '13%'}}
                >
                    <div className={classes.contentColumn}>

                    {!isMobile && (
                        <>

                            <img
                                src={exitModal}
                                alt="exitModal"
                                onClick={() => setOpenModal(false)}
                                className={classes.exit}
                            />

                            <div className={classes.header}>
                                {/* <div className={classes.item1}>
                                    <input
                                        type="search"
                                        placeholder="Найти"
                                        value={handleSearchValue}
                                        onChange={handleSearchOnChange}
                                        className={classes.search}
                                    />
                                </div> */}


                                <div className={classes.item2}>
                                    <ButtonImage
                                        name={"сохранить"}
                                        icon={Blacksavetmp}
                                        onClick={clickFunction || closeModal}
                                    ></ButtonImage>
                                </div>
                            </div>
                        </>
                    )}

                        {isMobile && (
                            <div className={classes.close}>
                            <img src={close} alt="close" onClick={() => setOpenModal(false)} />
                        </div>
                        )}
                        <div className={classes.content}>
                            {children}
                        </div>
                        {isMobile && (
                            <ButtonContainer
                                clickFunction={clickFunction || closeModal}
                                disabled={disabledButton}
                            >
                                {buttonText ? buttonText : 'Сохранить'}
                            </ButtonContainer>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
