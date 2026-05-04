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
    const [sliderValue, setSliderValue] = useState(0);

    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);
    const depthCacheRef = useRef({});
    
    const pendingCenterNodeIdRef = useRef(null); // Теперь хранит ID узла (поста или организации)
    const hoveredNodeIdRef = useRef(null); // ID узла под мышью
    const centeringTimerRef = useRef(null);

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
            if (isTransitioning) return;
            const organizationId = node.data.original?.id || node.id;
            navigate(`/structure/${organizationId}`);
        },
        [navigate, isTransitioning]
    );

    // Сохраняем ID узла (не организации!)
    const onNodeMouseEnter = useCallback((event, node) => {
        // Сохраняем ID самого узла, на который наведена мышь
        hoveredNodeIdRef.current = node.id;
        
        console.log('🟢 HOVER Node:', {
            id: node.id,
            label: node.data?.label,
            type: node.data?.isOrganization ? 'organization' : 'post',
            position: node.position
        });
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

    // Функция центрирования на узле (может быть пост или организация)
    const centerOnNode = useCallback((nodeId) => {
        if (centeringTimerRef.current) {
            clearTimeout(centeringTimerRef.current);
        }
        
        centeringTimerRef.current = setTimeout(() => {
            const currentNodes = getNodes();
            const targetNode = currentNodes.find(n => n.id === nodeId);
            
            if (targetNode) {
                console.log('✅ Centering on node:', {
                    id: targetNode.id,
                    label: targetNode.data?.label,
                    type: targetNode.data?.isOrganization ? 'organization' : 'post',
                    position: targetNode.position
                });
                
                setCenter(
                    targetNode.position.x,
                    targetNode.position.y,
                    { duration: 400, zoom: 1 }
                );
            } else {
                // Если узел не найден (например, пост скрыт на этом уровне),
                // ищем его родительскую организацию
                console.warn('Node not found, searching for parent...');
                fitView({ duration: 400, padding: 0.2, maxZoom: 1 });
            }
            
            centeringTimerRef.current = null;
        }, 350);
    }, [getNodes, setCenter, fitView]);

    // Эффект для центрирования после изменения глубины
    useEffect(() => {
        if (!isTransitioning && pendingCenterNodeIdRef.current) {
            const nodeId = pendingCenterNodeIdRef.current;
            pendingCenterNodeIdRef.current = null;
            centerOnNode(nodeId);
        }
    }, [isTransitioning, centerOnNode]);

    // Эффект для начального fitView
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

            // Сохраняем ID узла под мышью
            const targetNodeId = hoveredNodeIdRef.current;
            pendingCenterNodeIdRef.current = targetNodeId;
            
            console.log('🔄 Changing depth:', {
                from: maxDepth,
                to: newDepth,
                targetNode: targetNodeId
            });

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
                        style={{ '--value': `${sliderValue}%` }}
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