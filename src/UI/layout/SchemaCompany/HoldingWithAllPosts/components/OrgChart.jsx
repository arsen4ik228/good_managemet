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
    const { fitView, setViewport, getViewport, getNodes } = useReactFlow();

    const [maxDepth, setMaxDepth] = useState(1);
    const [maxAvailableDepth, setMaxAvailableDepth] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);
    const depthCacheRef = useRef({});
    
    // Храним ID организации, на которую наведена мышь
    const hoveredOrgIdRef = useRef(null);

    const onNodeClick = useCallback(
        (event, node) => {
            if (isTransitioning) return;
            const organizationId = node.data.original?.id || node.id;
            navigate(`/structure/${organizationId}`);
        },
        [navigate, isTransitioning]
    );

    // Обработчик наведения на узел
    const onNodeMouseEnter = useCallback((event, node) => {
        // Если это организация — запоминаем её ID
        if (node.data?.isOrganization) {
            hoveredOrgIdRef.current = node.id;
        } else {
            // Если это пост — запоминаем ID его организации
            hoveredOrgIdRef.current = node.data?.original?.organizationId || null;
        }
    }, []);

    const onNodeMouseLeave = useCallback(() => {
        // Не сбрасываем сразу, чтобы успеть использовать при скролле
        // hoveredOrgIdRef.current = null;
    }, []);

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

            // Запоминаем ID организации под мышью
            const targetOrgId = hoveredOrgIdRef.current;
            
            console.log('Changing depth to:', newDepth, 'Target org:', targetOrgId);

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
                                // Если есть целевая организация — центрируемся на ней
                                if (targetOrgId) {
                                    const targetNode = cached.nodes.find(n => n.id === targetOrgId);
                                    
                                    if (targetNode) {
                                        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
                                        if (bounds) {
                                            console.log('Centering on:', targetNode.id, targetNode.data?.label);
                                            
                                            setViewport(
                                                {
                                                    x: targetNode.position.x - bounds.width / 2,
                                                    y: targetNode.position.y - bounds.height / 3,
                                                    zoom: 1,
                                                },
                                                { duration: 400 }
                                            );
                                            return;
                                        }
                                    }
                                }
                                
                                // Если нет цели — просто fitView
                                fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
                            }, 30);
                        });
                    }, 200);
                });
            });
        },
        [maxDepth, maxAvailableDepth, isTransitioning, setNodes, setEdges, fitView, setViewport]
    );

    const handleIncreaseDepth = useCallback(() => changeDepth(maxDepth + 1), [maxDepth, changeDepth]);
    const handleDecreaseDepth = useCallback(() => changeDepth(maxDepth - 1), [maxDepth, changeDepth]);
    const handleResetDepth = useCallback(() => changeDepth(1), [changeDepth]);
    const handleShowAll = useCallback(() => changeDepth(maxAvailableDepth), [maxAvailableDepth, changeDepth]);

    const handleFitView = useCallback(() => {
        fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
    }, [fitView]);

    const handleWheel = useCallback(
        (event) => {
            event.preventDefault();
            const delta = event.deltaY;
            
            if (delta < 0) {
                handleIncreaseDepth();
            } else {
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
        <div 
            className={styles.container} 
            ref={containerRef} 
            onWheel={handleWheel}
        >
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
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
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