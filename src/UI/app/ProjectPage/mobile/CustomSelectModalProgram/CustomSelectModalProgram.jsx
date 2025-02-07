import React, { useEffect, useState } from 'react'
import classes from "./CustomSelectModalProgram.module.css"
import close from "@Custom/SearchModal/icon/icon _ add.svg"

export default function CustomSelectModalProgram({ setModalOpen, workers, projectsList, setProjectsList, setParentFiltredProjects, parentFilteredProjects }) {
    console.log('workers in Modal ', workers)
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        if (parentFilteredProjects && Array.isArray(parentFilteredProjects) && workers) {
            const filteredArray = parentFilteredProjects.map(project => {
                // Проверяем, нет ли project.id в projectsList
                if (!projectsList.some(element => element.id === project.id)) {
                    const targetWithProductType = project?.targets?.find(target => target.type === 'Продукт');
    
                    if (targetWithProductType) {
                        const worker = workers.find(worker => worker.id === targetWithProductType.holderUserId);
                        return {
                            id: project.id,
                            nameProject: project.projectName,
                            product: targetWithProductType.content,
                            deadline: targetWithProductType.deadline,
                            worker: worker ? worker.firstName + ' ' + worker.lastName : null,
                            avatar_url: worker ? worker.avatar_url : null
                        };
                    }
    
                    return {
                        id: project.id,
                        nameProject: project.projectName,
                        product: null,
                        deadline: null,
                        worker: null,
                        avatar_url: null
                    };
                }
    
                // Если project.id присутствует в projectsList, игнорируем этот проект
                return null;
            }).filter(Boolean); // Убираем null значения
    
            setFilteredProjects(filteredArray);
        }
    }, [parentFilteredProjects,workers]);




    const clickProject = (type, id) => {
        switch (type) {
            
            case 'delete':
                const newArray = projectsList.filter(item => item?.id !== id);
                const deletedProject = projectsList.find(item => item.id === id);
                setProjectsList(newArray);
                setFilteredProjects(prevState => [...prevState, deletedProject]);
                console.log(newArray, deletedProject)
                break;
            case 'added':
                const newFiltred = filteredProjects.filter(item => item?.id !== id)
                const deleteProject = filteredProjects.find(item => item?.id === id)
                console.log(deleteProject)
                setFilteredProjects(newFiltred);
                setProjectsList(prevState => [...prevState, deleteProject]);
                console.log(projectsList)
                break;
        }
    }


    console.log(filteredProjects, projectsList)

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.element_srch}>
                        <input type={classes.search} placeholder="Поиск" />
                    </div>

                    <div className={classes.body}>
                        {projectsList.map((item, index) => (
                            <div
                                key={index}
                                className={classes.projectContainer}
                                style={{ boxShadow: '0px 0px 2px 1px rgba(0, 84, 117, 1)' }}
                                onClick={() => clickProject('delete',item.id)}
                            >
                                <div className={classes.content}>
                                    <div className={classes.title}>{item?.nameProject}</div>
                                    <div className={classes.worker}>{item?.product}</div>
                                    <div className={classes.worker}>{item?.worker}</div>
                                    <div className={classes.data}>{item?.deadline?.slice(0, 10)}</div>
                                </div>
                                <div className={classes.checkBox}>
                                    <input type="checkbox" checked={true} />
                                </div>
                            </div>
                        ))}
                        {filteredProjects.map((item, index) => (
                            <div key={index} className={classes.projectContainer} onClick={() => clickProject('added',item.id)}>
                                <div className={classes.content}>
                                    <div className={classes.title}>{item.nameProject}</div>
                                    <div className={classes.worker}>{item?.product}</div>
                                    <div className={classes.worker}>{item?.worker}</div>
                                    <div className={classes.data}>{item?.deadline?.slice(0, 10)}</div>
                                </div>
                                <div className={classes.checkBox}>
                                    <input type="checkbox" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={classes.btn}>
                        <button onClick={() => setModalOpen(false)}>ДОБАВИТЬ</button>
                    </div>
                </div>
            </div>
        </>
    )
}
