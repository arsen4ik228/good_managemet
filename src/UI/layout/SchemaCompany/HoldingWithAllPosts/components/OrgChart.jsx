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
    const [sliderValue, setSliderValue] = useState(0);
    
    // Состояния анимации
    const [isZooming, setIsZooming] = useState(false);
    const [zoomDirection, setZoomDirection] = useState('in'); // 'in' или 'out'

    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);
    const depthCacheRef = useRef({});

    const pendingCenterNodeIdRef = useRef(null);
    const hoveredNodeIdRef = useRef(null);
    const centeringTimerRef = useRef(null);
    const wheelTimeoutRef = useRef(null);
    const pendingDepthRef = useRef(null);

    const percentToDepth = useCallback((percent) => {
        return Math.round((percent / 100) * (maxAvailableDepth - 1)) + 1;
    }, [maxAvailableDepth]);

    const depthToPercent = useCallback((depth) => {
        return ((depth - 1) / (maxAvailableDepth - 1)) * 100;
    }, [maxAvailableDepth]);

    useEffect(() => {
        setSliderValue(depthToPercent(maxDepth));
    }, [maxDepth, depthToPercent]);

    const onNodeClick = useCallback(
        (event, node) => {
            const organizationId = node.data.original?.id || node.id;
            navigate(`/structure/${organizationId}`);
        },
        [navigate]
    );

    const onNodeMouseEnter = useCallback((event, node) => {
        hoveredNodeIdRef.current = node.id;
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

    const centerOnNode = useCallback((nodeId) => {
        if (centeringTimerRef.current) {
            clearTimeout(centeringTimerRef.current);
        }

        centeringTimerRef.current = setTimeout(() => {
            const currentNodes = getNodes();
            const targetNode = currentNodes.find(n => n.id === nodeId);

            if (targetNode) {
                setCenter(
                    targetNode.position.x,
                    targetNode.position.y,
                    { duration: 0, zoom: 1 }
                );
            } else {
                fitView({ duration: 0, padding: 0.2, maxZoom: 1 });
            }

            centeringTimerRef.current = null;
        }, 50);
    }, [getNodes, setCenter, fitView]);

    // Эффект для центрирования после изменения глубины
    useEffect(() => {
        if (!isZooming && pendingCenterNodeIdRef.current) {
            const nodeId = pendingCenterNodeIdRef.current;
            pendingCenterNodeIdRef.current = null;
            centerOnNode(nodeId);
        }
    }, [isZooming, centerOnNode]);

    // Эффект для начального fitView
    useEffect(() => {
        if (nodes.length > 0 && maxDepth === 1) {
            const timer = setTimeout(() => {
                fitView({ duration: 0, padding: 0.2, maxZoom: 1 });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [nodes.length, maxDepth, fitView]);

    const changeDepth = useCallback(
        (newDepth) => {
            if (newDepth < 1 || newDepth > maxAvailableDepth) return;
            if (newDepth === maxDepth) return;

            const targetNodeId = hoveredNodeIdRef.current;
            pendingCenterNodeIdRef.current = targetNodeId;
            
            // Определяем направление
            const direction = newDepth > maxDepth ? 'in' : 'out';
            setZoomDirection(direction);
            
            // Запускаем анимацию приближения
            setIsZooming(true);
            
            // Меняем данные в середине анимации
            setTimeout(() => {
                const cached = depthCacheRef.current[newDepth];
                if (cached) {
                    setMaxDepth(newDepth);
                    setNodes(cached.nodes);
                    setEdges(cached.edges);
                }
            }, 150);
            
            // Завершаем анимацию
            setTimeout(() => {
                setIsZooming(false);
            }, 350);
        },
        [maxDepth, maxAvailableDepth, setNodes, setEdges]
    );

    const handleSliderChange = useCallback((event) => {
        const percent = Number(event.target.value);
        setSliderValue(percent);
        const newDepth = percentToDepth(percent);
        if (newDepth !== maxDepth) {
            changeDepth(newDepth);
        }
    }, [percentToDepth, maxDepth, changeDepth]);

    const handleIncreaseDepth = useCallback(() => {
        if (maxDepth < maxAvailableDepth) {
            changeDepth(maxDepth + 1);
        }
    }, [maxDepth, maxAvailableDepth, changeDepth]);

    const handleDecreaseDepth = useCallback(() => {
        if (maxDepth > 1) {
            changeDepth(maxDepth - 1);
        }
    }, [maxDepth, changeDepth]);

    const handleResetDepth = useCallback(() => changeDepth(1), [changeDepth]);

    const handleFitView = useCallback(() => {
        fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
    }, [fitView]);

    // Обработчик колёсика мыши с троттлингом
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (event) => {
            event.preventDefault();
            
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
            
            const direction = event.deltaY < 0 ? 1 : -1;
            pendingDepthRef.current = direction;
            
            wheelTimeoutRef.current = setTimeout(() => {
                if (pendingDepthRef.current === 1) {
                    handleIncreaseDepth();
                } else if (pendingDepthRef.current === -1) {
                    handleDecreaseDepth();
                }
                pendingDepthRef.current = null;
                wheelTimeoutRef.current = null;
            }, 100);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
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
            {/* Оверлей с анимацией приближения */}
            {(isZooming) && (
                <div className={`${styles.zoomOverlay} ${zoomDirection === 'in' ? styles.zoomIn : styles.zoomOut}`} />
            )}
            
            <div
                ref={reactFlowWrapper}
                className={styles.flowWrapper}
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

            {/* Компактный слайдер глубины */}
            <div className={styles.depthSliderContainer}>
                <div className={styles.sliderRow}>
                    <button
                        onClick={handleDecreaseDepth}
                        className={styles.sliderButton}
                        disabled={maxDepth <= 1}
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
                        style={{ '--value': `${sliderValue}%` }}
                    />

                    <button
                        onClick={handleIncreaseDepth}
                        className={styles.sliderButton}
                        disabled={maxDepth >= maxAvailableDepth}
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