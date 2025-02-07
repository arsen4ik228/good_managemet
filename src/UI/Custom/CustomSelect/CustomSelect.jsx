import React, {useState, useEffect, useRef} from 'react';
import classes from "./CustomSelect.module.css";
import close from "../SearchModal/icon/icon _ add.svg";

export default function CustomSelect({organizations, requestFunc, isToOrganizations, setToOrganizations, setModalOpen, }) {

    const [selectedItems, setSelectedItems] = useState();
    const [extractedOrganizations, setExtractedOrganizations] = useState([]);

    console.log('custom:  ',isToOrganizations)

    // const handleSelectItem = (id) => {
    //     setToOrganizations(prevIsToOrganizations =>
    //         prevIsToOrganizations.includes(id)
    //             ? prevIsToOrganizations.filter(item => item !== id)
    //             : [...prevIsToOrganizations, id]
    //     );

    //     setSelectedItems(prevSelectedItems =>
    //         prevSelectedItems.includes(id)
    //             ? prevSelectedItems.filter(item => item !== id)
    //             : [...prevSelectedItems, id]
    //     );
    // };

    const handleSelectItem = (id) => {
        setToOrganizations(id);
        setSelectedItems(id);
    };

    // useEffect(() => {
    //         setSelectedItems(isToOrganizations);

    // }, [isToOrganizations]);

    console.log('selectedItems:   ', selectedItems);

    const buttonClick = async () => {
        try {
          await requestFunc();
          setModalOpen(false);
        } catch (error) {
          console.error("Ошибка:", error);
        }
      };
      
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close}/>
                    </div>
                    <div className={classes.title}> Организации</div>
                    <div className={classes.list}>
                        <ul className={classes.selectList}>
                            {organizations?.map((item) => (
                                <li key={item.id} onClick={() => handleSelectItem(item.id)}>
                                    <input
                                        type="checkbox"
                                        checked={isToOrganizations?.includes(item.id)}
                                        readOnly
                                    />
                                    {item.organizationName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={classes.btn}>
                        <button onClick={() => buttonClick()}>СОХРАНИТЬ</button>
                    </div>
                </div>
            </div>
        </>

    );
}
