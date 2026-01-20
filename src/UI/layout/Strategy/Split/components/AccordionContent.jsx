import { useState, useRef, useEffect } from 'react';
import styles from "./AccordionContent.module.css";
import TextAreaRdx from '../../../../radixUI/textArea/TextAreaRdx';
import debounce from "lodash/debounce";

export const AccordionContent = ({
    project,
    name,
    info,
    product,
    updateProject,
}) => {

    const [projectData, setProjectData] = useState({
        name: name,
        product: product,
        info: info
    });

    // debounced-функция живёт в ref и НЕ пересоздаётся
    const debouncedSaveRef = useRef(null);


    const handleChange = (field) => (e) => {
        const value = e.target.value;

        setProjectData(prev => {
            const updated = { ...prev, [field]: value };

            // вызываем debounce с актуальными данными
            debouncedSaveRef.current(updated);

            return updated;
        });
    };


    // создаём debounce один раз
    useEffect(() => {
        debouncedSaveRef.current = debounce(async (data) => {
            try {
                await updateProject({
                    projectId: project.id,
                    _id: project.id,
                    projectName: data.name,
                    content: data.info,
                    targetUpdateDtos: [
                        {
                            _id: project?.targets?.find((item) => item.type === "Продукт")?.id,
                            type: "Продукт",
                            orderNumber: 1,
                            content: data.product,
                        },
                    ],
                }).unwrap();
            } catch (e) {
                console.error("Ошибка обновления проекта", e);
            }
        }, 2000); // ← задержка debounce

        return () => {
            debouncedSaveRef.current?.cancel();
        };
    }, [project, updateProject]);

    return (
        <>
            <div className={styles.infoLabel}>Информация по проекту</div>

            <TextAreaRdx className={styles.contentText}
                value={projectData.info}
                onChange={handleChange('info')}
                autoSize={{ minRows: 3, maxRows: 6 }} />
            <div className={styles.line}></div>


            <div className={styles.infoLabel}>Название проекта</div>
            <input
                className={styles.infoValue}
                value={projectData.name}
                onChange={handleChange('name')}
            />
            <div className={styles.line}></div>


            <div className={styles.infoLabel}>Продукт проекта</div>
            <input
                className={styles.infoValue}
                value={projectData.product}
                onChange={handleChange('product')}
            />
            <div className={styles.line}></div>
        </>
    );
};
