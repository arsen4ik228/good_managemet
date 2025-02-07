import React, { useMemo, useState } from 'react';
import classes from "./AttachPolicy.module.css";
import close from "../SearchModal/icon/icon _ add.svg";

function AttachPolicy({ title, setModalOpen, firstArray, componentName, setIds, id }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [localId, setLocalId] = useState(id)

    const selectItem = (itemId) => {
        setLocalId(prevState =>
            prevState === itemId ? null : itemId
        )
    }

    const filteredItems = useMemo(() =>
        firstArray.filter(item => item.policyName.toLowerCase().includes(searchTerm.toLowerCase())),
        [firstArray, searchTerm]
    )

    const confirmClick = () => {
        setIds(localId)
        setModalOpen(false)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} alt='close' />
                    </div>
                    <div className={classes.element_srch}>
                        <input
                            type="text"
                            placeholder="Поиск"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={classes.element_var}>
                        <div className={classes.heading}>{title}</div>
                        {filteredItems?.map((item, index) => (
                            <div
                                key={index}
                                className={classes.item}
                                onClick={() => selectItem(item.id)}
                            >
                                <span>
                                    {item[componentName]}
                                </span>
                                <input type="radio" checked={item.id === localId} />
                            </div>
                        ))}
                    </div>

                    <footer className={classes.footer}>
                        <button
                            onClick={() => confirmClick()}
                        >
                            Подтвердить
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default AttachPolicy;