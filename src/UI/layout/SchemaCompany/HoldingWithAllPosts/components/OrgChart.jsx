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
    const { fitView, getNodes, getViewport, setViewport } = useReactFlow();

    const [maxDepth, setMaxDepth] = useState(1);
    const [maxAvailableDepth, setMaxAvailableDepth] = useState(1);
    const [sliderValue, setSliderValue] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomDirection, setZoomDirection] = useState('in');

    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);
    const depthCacheRef = useRef({});
    const hoveredNodeIdRef = useRef(null);
    const wheelTimeoutRef = useRef(null);
    const pendingDepthRef = useRef(null);
    const zoomTimerRef = useRef(null);

    const percentToDepth = useCallback((percent) => {
        return Math.round((percent / 100) * (maxAvailableDepth - 1)) + 1;
    }, [maxAvailableDepth]);

    const depthToPercent = useCallback((depth) => {
        return ((depth - 1) / (maxAvailableDepth - 1)) * 100;
    }, [maxAvailableDepth]);

    useEffect(() => {
        setSliderValue(depthToPercent(maxDepth));
    }, [maxDepth, depthToPercent]);

    const onNodeClick = useCallback((event, node) => {
        navigate(`/structure/${node.data.original?.id || node.id}`);
    }, [navigate]);

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

    // Начальный fitView
    useEffect(() => {
        if (nodes.length > 0 && maxDepth === 1 && !isZooming) {
            const timer = setTimeout(() => {
                fitView({ duration: 0, padding: 0.2, maxZoom: 1 });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [nodes.length, maxDepth, isZooming, fitView]);

const changeDepth = useCallback((newDepth) => {
    if (newDepth < 1 || newDepth > maxAvailableDepth) return;
    if (newDepth === maxDepth) return;

    const targetNodeId = hoveredNodeIdRef.current;
    const cached = depthCacheRef.current[newDepth];
    if (!cached) return;

    // 1. Запоминаем экранную позицию узла
    let targetScreenPos = null;
    if (targetNodeId) {
        const currentNode = getNodes().find(n => n.id === targetNodeId);
        const viewport = getViewport();
        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (currentNode && viewport && bounds) {
            targetScreenPos = {
                x: (currentNode.position.x * viewport.zoom) + viewport.x + bounds.width / 2,
                y: (currentNode.position.y * viewport.zoom) + viewport.y + bounds.height / 2,
            };
        }
    }

    // 2. Определяем направление
    const direction = newDepth > maxDepth ? 'in' : 'out';

    // 3. Сбрасываем таймер размытия
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);

    // 4. ЗАПУСКАЕМ АНИМАЦИЮ СРАЗУ (пересоздаём оверлей)
    setIsZooming(false);
    requestAnimationFrame(() => {
        setZoomDirection(direction);
        setIsZooming(true);

        // 5. МЕНЯЕМ ДАННЫЕ ПОСЛЕ ЗАПУСКА АНИМАЦИИ
        requestAnimationFrame(() => {
            setMaxDepth(newDepth);
            setNodes(cached.nodes);
            setEdges(cached.edges);

            // 6. Фиксируем позицию узла после рендера
            setTimeout(() => {
                if (targetScreenPos && targetNodeId) {
                    const newNode = getNodes().find(n => n.id === targetNodeId);
                    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
                    if (newNode && bounds) {
                        setViewport(
                            {
                                x: targetScreenPos.x - bounds.width / 2 - (newNode.position.x * 1),
                                y: targetScreenPos.y - bounds.height / 2 - (newNode.position.y * 1),
                                zoom: 1,
                            },
                            { duration: 0 }
                        );
                    } else {
                        fitView({ duration: 0, padding: 0.2, maxZoom: 1 });
                    }
                } else {
                    fitView({ duration: 0, padding: 0.2, maxZoom: 1 });
                }
            }, 50);
        });
    });

    // 7. Снимаем размытие через 800ms
    zoomTimerRef.current = setTimeout(() => {
        setIsZooming(false);
    }, 800);
}, [maxDepth, maxAvailableDepth, setNodes, setEdges, getNodes, getViewport, setViewport, fitView]);


    const handleSliderChange = useCallback((event) => {
        const percent = Number(event.target.value);
        setSliderValue(percent);
        const newDepth = percentToDepth(percent);
        if (newDepth !== maxDepth) changeDepth(newDepth);
    }, [percentToDepth, maxDepth, changeDepth]);

    const handleIncreaseDepth = useCallback(() => {
        if (maxDepth < maxAvailableDepth) changeDepth(maxDepth + 1);
    }, [maxDepth, maxAvailableDepth, changeDepth]);

    const handleDecreaseDepth = useCallback(() => {
        if (maxDepth > 1) changeDepth(maxDepth - 1);
    }, [maxDepth, changeDepth]);

    const handleResetDepth = useCallback(() => changeDepth(1), [changeDepth]);

    const handleFitView = useCallback(() => {
        fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
    }, [fitView]);

    // Обработчик колёсика мыши
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (event) => {
            event.preventDefault();

            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);

            const direction = event.deltaY < 0 ? 1 : -1;
            pendingDepthRef.current = direction;

            wheelTimeoutRef.current = setTimeout(() => {
                if (pendingDepthRef.current === 1) handleIncreaseDepth();
                else if (pendingDepthRef.current === -1) handleDecreaseDepth();
                pendingDepthRef.current = null;
                wheelTimeoutRef.current = null;
            }, 100);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
            if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
        };
    }, [handleIncreaseDepth, handleDecreaseDepth]);

    if (isLoading) {
        return <div className={styles.messageContainer}><div className={styles.loader}>Загрузка...</div></div>;
    }

    if (isError) {
        return <div className={styles.messageContainer}><div className={styles.error}>Ошибка</div></div>;
    }

    if (!data || data.length === 0) {
        return <div className={styles.messageContainer}><div className={styles.empty}>Нет данных</div></div>;
    }

    return (
        <div className={styles.container} ref={containerRef}>
            {isZooming && <div className={`${styles.zoomOverlay} ${zoomDirection === 'in' ? styles.zoomIn : styles.zoomOut}`} />}

            <div ref={reactFlowWrapper} className={styles.flowWrapper} style={{ width: '100%', height: '100%' }}>
                <ReactFlow
                    nodes={nodes} edges={edges} nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick} onNodeMouseEnter={onNodeMouseEnter}
                    fitView={false} minZoom={1} maxZoom={1}
                    nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
                    panOnDrag={true} zoomOnScroll={false} zoomOnPinch={false} preventScrolling={false}
                    defaultEdgeOptions={{ type: 'step', style: { stroke: '#CCCCCC', strokeWidth: 5 } }}
                    proOptions={{ hideAttribution: true }}
                >
                    <MiniMap nodeColor="#CCCCCC" maskColor="rgba(0, 0, 0, 0.05)" />
                    <Background color="#CCCCCC" gap={16} size={1} variant="dots" />
                </ReactFlow>
            </div>

            <div className={styles.depthSliderContainer}>
                <div className={styles.sliderRow}>
                    <button onClick={handleDecreaseDepth} className={styles.sliderButton} disabled={maxDepth <= 1}>−</button>
                    <input type="range" min="0" max="100" value={sliderValue} onChange={handleSliderChange} className={styles.depthSlider} style={{ '--value': `${sliderValue}%` }} />
                    <button onClick={handleIncreaseDepth} className={styles.sliderButton} disabled={maxDepth >= maxAvailableDepth}>+</button>
                </div>
                <div className={styles.sliderValue}>{Math.round(sliderValue)}%</div>
                <div className={styles.sliderActions}>
                    <button onClick={handleResetDepth} className={styles.actionButton}>↺</button>
                    <button onClick={handleFitView} className={styles.actionButton}>⌖</button>
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