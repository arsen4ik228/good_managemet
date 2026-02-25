import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, Input, List } from "antd";

const { Search } = Input;

const ModalSelectProject = ({
                                projects,
                                setProjectInProgram,
                                projectIdsInProgram,
                                setProjectIdsInProgram,
                                isDirtyRef
                            }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [checkedItems, setCheckedItems] = useState([]);

    // При открытии модалки синхронизируем выбранные чекбоксы с projectIdsInProgram
    useEffect(() => {
        setCheckedItems(projectIdsInProgram);
    }, [isModalVisible, projectIdsInProgram]);

    const filteredItems = projects.filter(item =>
        item.projectName.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleCheck = (project) => {
        const projectId = project.id;

        let newChecked;
        if (checkedItems.includes(projectId)) {
            // Снять отметку
            newChecked = checkedItems.filter(id => id !== projectId);
        } else {
            // Отметить
            newChecked = [...checkedItems, projectId];
        }
        setCheckedItems(newChecked);

        // Сохраняем только id для projectIdsInProgram
        setProjectIdsInProgram(newChecked);

        // Сохраняем полные объекты для setProjectInProgram
        const selectedProjects = projects.filter(p => newChecked.includes(p.id));
        setProjectInProgram(selectedProjects);

        isDirtyRef.current = true;
    };

    return (
        <>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Изменить задачи
            </Button>

            <Modal
                title="Проекты"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Search
                    placeholder="Поиск"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <List
                    dataSource={filteredItems}
                    renderItem={(item) => (
                        <List.Item>
                            <Checkbox
                                checked={checkedItems.includes(item.id)}
                                onChange={() => toggleCheck(item)}
                            >
                                {item.projectName}
                            </Checkbox>
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default ModalSelectProject;