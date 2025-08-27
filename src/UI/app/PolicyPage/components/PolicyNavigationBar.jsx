import { Card, Drawer, Tabs, Button, Input } from 'antd';
import { UpOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import classes from './PolicyNavigationBar.module.css'

export const PolicyNavigationBar = ({
    directivesDraft = [],
    instructionsDraft = [],
    disposalsDraft = [],
    directivesActive = [],
    instructionsActive = [],
    disposalsActive = [],
    directivesCompleted = [],
    instructionsCompleted = [],
    disposalsCompleted = [],
    foldersSort = [],
    policyId,
    setPolicyId,
    updateDirectory,

    drawerOpen,
    setDrawerOpen,
}) => {
    // Состояние для отслеживания свернутых карточек
    const [collapsedCards, setCollapsedCards] = useState({});

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (value) => {
        if (!value.trim()) {
            setSearchResults(null);
            return;
        }

        const query = value.toLowerCase();

        // Поиск по политикам
        const searchInItems = (items) =>
            items.filter(item => item.policyName.toLowerCase().includes(query));

        const results = {
            active: {
                directives: searchInItems(directivesActive),
                instructions: searchInItems(instructionsActive),
                disposals: searchInItems(disposalsActive),
                hasData: false // Флаг для проверки наличия данных
            },
            drafts: {
                directives: searchInItems(directivesDraft),
                instructions: searchInItems(instructionsDraft),
                disposals: searchInItems(disposalsDraft),
                hasData: false
            },
            completed: {
                directives: searchInItems(directivesCompleted),
                instructions: searchInItems(instructionsCompleted),
                disposals: searchInItems(disposalsCompleted),
                hasData: false
            },
            folders: {
                items: foldersSort.filter(folder =>
                    folder.directoryName.toLowerCase().includes(query) ||
                    folder.policyToPolicyDirectories.some(policy =>
                        policy.policy.policyName.toLowerCase().includes(query)
                    )
                ),
                hasData: false
            }
        };

        // Проверяем есть ли данные в каждой группе
        results.active.hasData = Object.values(results.active)
            .slice(0, 3) // Исключаем hasData из проверки
            .some(arr => arr.length > 0);

        results.drafts.hasData = Object.values(results.drafts)
            .slice(0, 3)
            .some(arr => arr.length > 0);

        results.completed.hasData = Object.values(results.completed)
            .slice(0, 3)
            .some(arr => arr.length > 0);

        results.folders.hasData = results.folders.items.length > 0;

        // Проверяем есть ли вообще результаты
        const hasAnyResults = [
            results.active.hasData,
            results.drafts.hasData,
            results.completed.hasData,
            results.folders.hasData
        ].some(Boolean);

        setSearchResults(hasAnyResults ? results : 'not_found');
    };

    const renderSearchResults = () => {
        if (searchResults === 'not_found') {
            return (
                <div className={classes.noResults}>
                    <div>Ничего не найдено</div>
                    <Button
                        type="link"
                        onClick={() => {
                            setSearchQuery('');
                            setSearchResults(null);
                        }}
                    >
                        Очистить поиск
                    </Button>
                </div>
            );
        }

        if (!searchResults) return null;

        return (
            <div className={classes.searchResultsContainer}>
                {/* Активные */}
                {searchResults.active.hasData && (
                    <div className={classes.resultsGroup}>
                        <h4 className={classes.resultsGroupTitle}>Активные</h4>
                        {searchResults.active.directives.map(renderResultItem)}
                        {searchResults.active.instructions.map(renderResultItem)}
                        {searchResults.active.disposals.map(renderResultItem)}
                    </div>
                )}

                {/* Черновики */}
                {searchResults.drafts.hasData && (
                    <div className={classes.resultsGroup}>
                        <h4 className={classes.resultsGroupTitle}>Черновики</h4>
                        {searchResults.drafts.directives.map(renderResultItem)}
                        {searchResults.drafts.instructions.map(renderResultItem)}
                        {searchResults.drafts.disposals.map(renderResultItem)}
                    </div>
                )}

                {/* Завершенные */}
                {searchResults.completed.hasData && (
                    <div className={classes.resultsGroup}>
                        <h4 className={classes.resultsGroupTitle}>Завершенные</h4>
                        {searchResults.completed.directives.map(renderResultItem)}
                        {searchResults.completed.instructions.map(renderResultItem)}
                        {searchResults.completed.disposals.map(renderResultItem)}
                    </div>
                )}

                {/* Папки */}
                {searchResults.folders.hasData && (
                    <div className={classes.resultsGroup}>
                        <h4 className={classes.resultsGroupTitle}>Папки</h4>
                        {searchResults.folders.items.map(folder => (
                            <div key={folder.id} className={classes.folderGroup}>
                                <div className={classes.folderHeader}>
                                    <span className={classes.folderName}>
                                        {folder.directoryName}
                                    </span>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateDirectory(folder);
                                        }}
                                        className={classes.folderEditButton}
                                    />
                                </div>
                                <div className={classes.folderPolicies}>
                                    {folder.policyToPolicyDirectories
                                        .filter(policy =>
                                            policy.policy.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            folder.directoryName.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map(policy => (
                                            <div
                                                key={policy.policy.id}
                                                className={classes.folderPolicyItem}
                                                onClick={() => {
                                                    setPolicyId(policy.policy.id);
                                                    setSearchResults(null);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                {policy.policy.policyName}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Рендер одного элемента результата
    const renderResultItem = (item) => (
        <div
            key={item.id}
            className={classes.resultItem}
            onClick={() => {
                setPolicyId(item.id);
                setSearchResults(null);
                setSearchQuery('');
            }}
        >
            {item.policyName}
        </div>
    );

    // Конфигурация типов документов
    const docTypes = [
        { key: 'directives', title: 'Директивы' },
        { key: 'instructions', title: 'Инструкции' },
        { key: 'disposals', title: 'Распоряжения' }
    ];

    // Конфигурация статусов
    const statuses = [
        {
            key: 'active',
            label: 'Активные',
            getData: (type) => ({
                directives: directivesActive,
                instructions: instructionsActive,
                disposals: disposalsActive
            }[type]),
            extraItems: foldersSort
        },
        {
            key: 'drafts',
            label: 'Черновики',
            getData: (type) => ({
                directives: directivesDraft,
                instructions: instructionsDraft,
                disposals: disposalsDraft
            }[type])
        },
        {
            key: 'finish',
            label: 'Архивные',
            getData: (type) => ({
                directives: directivesCompleted,
                instructions: instructionsCompleted,
                disposals: disposalsCompleted
            }[type])
        }
    ];

    // Функция для переключения состояния свертывания карточки
    const toggleCollapse = (cardKey) => {
        setCollapsedCards(prev => ({
            ...prev,
            [cardKey]: !prev[cardKey]
        }));
    };

    // Функция рендера карточки
    const renderCard = (title, items, cardKey) => (
        <Card
            key={cardKey}
            size='small'
            className={classes.card}
            title={title}
            extra={
                <Button
                    type="text"
                    size="small"
                    icon={collapsedCards[cardKey] ? <DownOutlined /> : <UpOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(cardKey);
                    }}
                />
            }
        >
            {!collapsedCards[cardKey] && (
                <>
                    {items.length === 0 && (
                        <>
                            <div>Нет данных</div>
                        </>
                    )}
                    {items?.map(item => (
                        <p key={item.id}
                            onClick={() => setPolicyId(item.id)}
                            className={policyId === item.id ? classes.currentPolicy : null}
                        >
                            {item.policyName}
                        </p>
                    ))}
                </>
            )}
        </Card>
    );

    // Функция рендера дополнительных элементов (для активных документов)
    const renderExtraCards = (items) =>
        items?.map(item => {
            const cardKey = `extra_${item.directoryName}`;
            return (
                <Card
                    key={cardKey}
                    size='small'
                    className={classes.card}
                    title={item.directoryName}
                    extra={
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateDirectory(item)
                                }}
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={collapsedCards[cardKey] ? <DownOutlined /> : <UpOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCollapse(cardKey);
                                }}
                            />
                        </div>
                    }
                >
                    {!collapsedCards[cardKey] && item.policyToPolicyDirectories?.map(elem => (
                        <p key={elem.policy.id}
                            className={policyId === elem.policy.id ? classes.currentPolicy : null}
                            onClick={() => setPolicyId(elem.policy.id)}
                        >
                            {elem.policy.policyName}
                        </p>
                    ))}
                </Card>
            );
        });

    // Генерация items для Tabs
    const items = statuses.map(({ key, label, getData, extraItems }) => ({
        key,
        label,
        children: (
            <>
                {docTypes.map(({ key: typeKey, title }) =>
                    renderCard(title, getData(typeKey), `${key}_${typeKey}`)
                )}
                {extraItems && renderExtraCards(extraItems)}
            </>
        )
    }));

    return (
        <Drawer
            title="Выберите политику"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="left"
            mask={false}
            width="27.7%"
        >
            <Input.Search
                placeholder="Поиск политик..."
                allowClear
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={classes.searchInput}
                style={{ marginBottom: 16 }}
                onSearch={handleSearch}
            />
            <div className={classes.searchWindow}>
                {searchResults ? (
                    renderSearchResults()
                ) : (
                    <Tabs items={items} type="card" className={classes.tabs} />
                )}
            </div>
        </Drawer>
    );
};