import React from 'react';
import classes from "./SearchModal.module.css";
import close from "./icon/icon _ add.svg";

function SearchModal({setSelectedId, setModalOpen, firstArray, firstTitle, secondArray, secondTitle, componentName}) {

    const [openFirst, setOpenFirst] = React.useState(true);
    const [openSecond, setOpenSecond] = React.useState(true);

    const handleArrayItems = (items) => {
        return (
            <>
                {items.map((item, index) => (
                    <div key={index} className={classes.item} onClick={() => clickPolicyId(item.id)}>
                        {item[`${componentName}`]}
                    </div>
                ))}
            </>
        );
    };

    const openListFirst = () => {
        openFirst ? setOpenFirst(false) : setOpenFirst(true);
    }
    const openListSecond = () => {
        openSecond ? setOpenSecond(false) : setOpenSecond(true);
    }
    const clickPolicyId = (id) => {
        setSelectedId(id)
        setModalOpen(false);
    }
    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close}/>
                    </div>
                    <div className={classes.element_srch}>

                        <input type="search" placeholder="Поиск"/>
                    </div>
                    <div className={classes.element_var}>
                        <div className={classes.heading} onClick={openListFirst}>{firstTitle}</div>
                        {openFirst && handleArrayItems(firstArray)}

                        {secondArray && (
                            <>
                                <div className={classes.heading} onClick={openListSecond}>{secondTitle}</div>
                                {openSecond && handleArrayItems(secondArray)}
                            </>
                        )}


                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchModal;