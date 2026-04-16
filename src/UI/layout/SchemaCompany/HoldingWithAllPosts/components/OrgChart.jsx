// 1. Убираем все контролы зума
// 2. Фиксируем minZoom и maxZoom на 1
// 3. Убираем handleZoomIn, handleZoomOut, zoomToPoint, handleWheel для зума
// 4. Колёсико мыши теперь управляет глубиной

import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import ReactFlow, {
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import { buildTree, layoutTree, filterTreeByDepth, getMaxAvailableDepth } from "../utils/treeLayout";
import styles from "./OrgChart.module.css";
import CustomNode from "../utils/CustomNode";

const nodeTypes = {
    custom: CustomNode,
};

function OrgChartContent({ data, isLoading, isError }) {
    const navigate = useNavigate();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView, setViewport, getViewport } = useReactFlow();

    const [maxDepth, setMaxDepth] = useState(1);
    const [maxAvailableDepth, setMaxAvailableDepth] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);
    const viewportCenterRef = useRef(null);
    const depthCacheRef = useRef({});

    const onNodeClick = useCallback(
        (event, node) => {
            if (isTransitioning) return;
            const organizationId = node.id;
            const organizationName = node.data.label;
            navigate(`/structure/${organizationId}`);
        },
        [navigate, isTransitioning]
    );

    const captureViewportCenter = useCallback(() => {
        const viewport = getViewport();
        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (bounds) {
            const centerX = (bounds.width / 2 - viewport.x) / viewport.zoom;
            const centerY = (bounds.height / 2 - viewport.y) / viewport.zoom;
            viewportCenterRef.current = { x: centerX, y: centerY };
        }
    }, [getViewport]);

    // Предварительный расчёт всех уровней
    useEffect(() => {
        if (data && data.length > 0) {
            try {
                const fullTree = buildTree(data);
                const maxAvail = getMaxAvailableDepth(fullTree);
                setMaxAvailableDepth(maxAvail);

                const cache = {};
                for (let depth = 1; depth <= maxAvail; depth++) {
                    const filteredTree = filterTreeByDepth(fullTree, depth);
                    const { nodes: layoutNodes, edges: layoutEdges } = layoutTree(filteredTree);
                    cache[depth] = {
                        nodes: layoutNodes,
                        edges: layoutEdges.map((e) => ({ ...e, markerEnd: undefined })),
                    };
                }
                depthCacheRef.current = cache;

                const level1 = cache[1];
                if (level1) {
                    setNodes(level1.nodes);
                    setEdges(level1.edges);
                }
            } catch (error) {
                console.error("Error building tree:", error);
            }
        } else {
            setNodes([]);
            setEdges([]);
            depthCacheRef.current = {};
        }
    }, [data, setNodes, setEdges]);

    const changeDepth = useCallback(
        (newDepth) => {
            if (newDepth < 1 || newDepth > maxAvailableDepth) return;
            if (newDepth === maxDepth) return;
            if (isTransitioning) return;

            const cached = depthCacheRef.current[newDepth];
            if (!cached) return;

            captureViewportCenter();
            setIsTransitioning(true);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        setMaxDepth(newDepth);
                        setNodes(cached.nodes);
                        setEdges(cached.edges);

                        requestAnimationFrame(() => {
                            setIsTransitioning(false);

                            setTimeout(() => {
                                if (viewportCenterRef.current) {
                                    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
                                    if (bounds) {
                                        const viewport = getViewport();
                                        const center = viewportCenterRef.current;
                                        setViewport(
                                            {
                                                x: center.x * viewport.zoom - bounds.width / 2,
                                                y: center.y * viewport.zoom - bounds.height / 2,
                                                zoom: 1, // фиксированный зум
                                            },
                                            { duration: 0 }
                                        );
                                        viewportCenterRef.current = null;
                                    }
                                }
                                fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
                            }, 20);
                        });
                    }, 200);
                });
            });
        },
        [maxDepth, maxAvailableDepth, isTransitioning, captureViewportCenter, setNodes, setEdges, fitView, getViewport, setViewport]
    );

    const handleIncreaseDepth = useCallback(() => changeDepth(maxDepth + 1), [maxDepth, changeDepth]);
    const handleDecreaseDepth = useCallback(() => changeDepth(maxDepth - 1), [maxDepth, changeDepth]);
    const handleResetDepth = useCallback(() => changeDepth(1), [changeDepth]);
    const handleShowAll = useCallback(() => changeDepth(maxAvailableDepth), [maxAvailableDepth, changeDepth]);

    const handleFitView = useCallback(() => {
        fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
    }, [fitView]);

    // Колёсико мыши управляет глубиной
    const handleWheel = useCallback(
        (event) => {
            event.preventDefault();
            const delta = event.deltaY;
            
            if (delta < 0) {
                // Крутим вверх - увеличиваем глубину
                handleIncreaseDepth();
            } else {
                // Крутим вниз - уменьшаем глубину
                handleDecreaseDepth();
            }
        },
        [handleIncreaseDepth, handleDecreaseDepth]
    );

    useEffect(() => {
        if (nodes.length > 0 && !isTransitioning && maxDepth === 1) {
            setTimeout(() => fitView({ duration: 0, padding: 0.2, maxZoom: 1 }), 50);
        }
    }, []);

    if (isLoading) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.loader}>Загрузка структуры компании...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.error}>Ошибка при загрузке данных</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.empty}>Нет данных для отображения</div>
            </div>
        );
    }

    return (
        <div className={styles.container} ref={containerRef} onWheel={handleWheel}>
            <div
                ref={reactFlowWrapper}
                className={`${styles.flowWrapper} ${isTransitioning ? styles.fadeOut : ''}`}
                style={{ width: '100%', height: '100%' }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView={false}
                    minZoom={1}
                    maxZoom={1}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={true}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    preventScrolling={false}
                    defaultEdgeOptions={{
                        type: 'step',
                        style: { stroke: '#CCCCCC', strokeWidth: 5 },
                    }}
                    proOptions={{ hideAttribution: true }}
                >
                    <MiniMap nodeColor="#CCCCCC" maskColor="rgba(0, 0, 0, 0.05)" />
                    <Background color="#CCCCCC" gap={16} size={1} variant="dots" />
                </ReactFlow>
            </div>

            {/* Панель управления глубиной */}
            <div className={styles.depthControls}>
                <div className={styles.depthInfo}>
                    Уровень: {maxDepth} / {maxAvailableDepth}
                </div>
                <div className={styles.depthButtons}>
                    <button
                        onClick={handleDecreaseDepth}
                        className={styles.depthButton}
                        disabled={maxDepth <= 1 || isTransitioning}
                        title="Уменьшить глубину (колёсико вниз)"
                    >
                        −
                    </button>
                    <button
                        onClick={handleIncreaseDepth}
                        className={styles.depthButton}
                        disabled={maxDepth >= maxAvailableDepth || isTransitioning}
                        title="Увеличить глубину (колёсико вверх)"
                    >
                        +
                    </button>
                    <button
                        onClick={handleResetDepth}
                        className={styles.depthButton}
                        disabled={isTransitioning}
                        title="Сбросить до 1 уровня"
                    >
                        ↺
                    </button>
                    <button
                        onClick={handleShowAll}
                        className={styles.depthButton}
                        disabled={isTransitioning}
                        title="Показать всё"
                    >
                        ⊞
                    </button>
                </div>
                <div className={styles.wheelHint}>
                    ↕️ Колёсико
                </div>
            </div>

            {/* Кнопка центрирования */}
            <button
                onClick={handleFitView}
                className={styles.centerButton}
                title="Центрировать вид"
            >
                ⌖
            </button>
        </div>
    );
}

export default function OrgChart(props) {
    return (
        <ReactFlowProvider>
            <OrgChartContent {...props} />
        </ReactFlowProvider>
    );
}