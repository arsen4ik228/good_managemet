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
    const { fitView, getNodes, setCenter } = useReactFlow();

    const [maxDepth, setMaxDepth] = useState(1);
    const [maxAvailableDepth, setMaxAvailableDepth] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [sliderValue, setSliderValue] = useState(0); // 0-100%

    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);
    const depthCacheRef = useRef({});

    const pendingCenterOrgIdRef = useRef(null);
    const hoveredOrgIdRef = useRef(null);
    const centeringTimerRef = useRef(null);

    // Конвертация процентов в глубину
    const percentToDepth = useCallback((percent) => {
        return Math.round((percent / 100) * (maxAvailableDepth - 1)) + 1;
    }, [maxAvailableDepth]);

    // Конвертация глубины в проценты
    const depthToPercent = useCallback((depth) => {
        return ((depth - 1) / (maxAvailableDepth - 1)) * 100;
    }, [maxAvailableDepth]);

    // Обновление слайдера при изменении maxDepth
    useEffect(() => {
        setSliderValue(depthToPercent(maxDepth));
    }, [maxDepth, depthToPercent]);

    const onNodeClick = () => true
    // useCallback(
    //     (event, node) => {
    //         if (isTransitioning) return;
    //         const organizationId = node.data.original?.id || node.id;
    //         navigate(`/structure/${organizationId}`);
    //     },
    //     [navigate, isTransitioning]
    // );

    const onNodeMouseEnter = useCallback((event, node) => {
        if (node.data?.isOrganization) {
            hoveredOrgIdRef.current = node.id;
        } else {
            hoveredOrgIdRef.current = node.data?.original?.organizationId || null;
        }
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

    const centerOnOrganization = useCallback((orgId) => {
        if (centeringTimerRef.current) {
            clearTimeout(centeringTimerRef.current);
        }

        centeringTimerRef.current = setTimeout(() => {
            const currentNodes = getNodes();
            const targetNode = currentNodes.find(n => n.id === orgId);

            if (targetNode) {
                setCenter(
                    targetNode.position.x,
                    targetNode.position.y,
                    { duration: 400, zoom: 1 }
                );
            } else {
                fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
            }

            centeringTimerRef.current = null;
        }, 350);
    }, [getNodes, setCenter, fitView]);

    useEffect(() => {
        if (!isTransitioning && pendingCenterOrgIdRef.current) {
            const orgId = pendingCenterOrgIdRef.current;
            pendingCenterOrgIdRef.current = null;
            centerOnOrganization(orgId);
        }
    }, [isTransitioning, centerOnOrganization]);

    useEffect(() => {
        if (nodes.length > 0 && !isTransitioning && maxDepth === 1) {
            const timer = setTimeout(() => {
                fitView({ duration: 0, padding: 0.2, maxZoom: 1 });
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [nodes.length, isTransitioning, maxDepth, fitView]);

    const changeDepth = useCallback(
        (newDepth) => {
            if (newDepth < 1 || newDepth > maxAvailableDepth) return;
            if (newDepth === maxDepth) return;
            if (isTransitioning) return;

            const cached = depthCacheRef.current[newDepth];
            if (!cached) return;

            pendingCenterOrgIdRef.current = hoveredOrgIdRef.current;

            setIsTransitioning(true);

            setTimeout(() => {
                setMaxDepth(newDepth);
                setNodes(cached.nodes);
                setEdges(cached.edges);

                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, 200);
        },
        [maxDepth, maxAvailableDepth, isTransitioning, setNodes, setEdges]
    );

    // Обработчик изменения слайдера
    const handleSliderChange = useCallback((event) => {
        const percent = Number(event.target.value);
        setSliderValue(percent);
        const newDepth = percentToDepth(percent);
        if (newDepth !== maxDepth) {
            changeDepth(newDepth);
        }
    }, [percentToDepth, maxDepth, changeDepth]);

    const handleIncreaseDepth = useCallback(() => changeDepth(maxDepth + 1), [maxDepth, changeDepth]);
    const handleDecreaseDepth = useCallback(() => changeDepth(maxDepth - 1), [maxDepth, changeDepth]);
    const handleResetDepth = useCallback(() => changeDepth(1), [changeDepth]);
    const handleShowAll = useCallback(() => changeDepth(maxAvailableDepth), [maxAvailableDepth, changeDepth]);

    const handleFitView = useCallback(() => {
        fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
    }, [fitView]);

    // Обработчик колёсика мыши
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (event) => {
            event.preventDefault();
            const delta = event.deltaY;

            if (delta < 0) {
                handleIncreaseDepth();
            } else {
                handleDecreaseDepth();
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [handleIncreaseDepth, handleDecreaseDepth]);

    useEffect(() => {
        return () => {
            if (centeringTimerRef.current) {
                clearTimeout(centeringTimerRef.current);
            }
        };
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
        <div className={styles.container} ref={containerRef}>
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

            {/* Новый слайдер глубины */}
            {/* Компактный слайдер глубины */}
            <div className={styles.depthSliderContainer}>
                <div className={styles.sliderRow}>
                    <button
                        onClick={handleDecreaseDepth}
                        className={styles.sliderButton}
                        disabled={maxDepth <= 1 || isTransitioning}
                        title="Уменьшить глубину"
                    >
                        −
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className={styles.depthSlider}
                        disabled={isTransitioning}
                    />

                    <button
                        onClick={handleIncreaseDepth}
                        className={styles.sliderButton}
                        disabled={maxDepth >= maxAvailableDepth || isTransitioning}
                        title="Увеличить глубину"
                    >
                        +
                    </button>
                </div>

                <div className={styles.sliderValue}>
                    {Math.round(sliderValue)}%
                </div>

                <div className={styles.sliderActions}>
                    <button
                        onClick={handleResetDepth}
                        className={styles.actionButton}
                        disabled={isTransitioning}
                        title="Сбросить"
                    >
                        ↺
                    </button>
                    <button
                        onClick={handleFitView}
                        className={styles.actionButton}
                        title="Центрировать"
                    >
                        ⌖
                    </button>
                </div>
            </div>

            {/* Кнопки управления */}
            <div className={styles.depthControls}>
                <button
                    onClick={handleResetDepth}
                    className={styles.iconButton}
                    disabled={isTransitioning}
                    title="Сбросить до 1 уровня"
                >
                    ↺
                </button>
                <button
                    onClick={handleFitView}
                    className={styles.iconButton}
                    title="Центрировать вид"
                >
                    ⌖
                </button>
            </div>
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