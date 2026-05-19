import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
    MiniMap,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
} from "reactflow";
import bgSvg from '@image/schema_background.svg';
import "reactflow/dist/style.css";
import styles from "./OrgChart.module.css";

import OrgNode from "../utils/OrgNode";
import NodeCard from "../utils/NodeCard";
import { NodeExpansionContext } from "../utils/NodeExpansionContext";
import { buildTree as buildHighLevelTree, layoutTree as layoutHighLevelTree } from "../utils/highLevelLayout";
import {
    buildTree as buildCombinedTree,
    layoutTree as layoutCombinedTree,
    filterTreeByDepth,
    getMaxAvailableDepth,
} from "../utils/combinedLayout";

const SVG_ASPECT = 1920 / 873;
const BG_STEP_SCALE = 0.9; // 9% per step

function ScaledBackground({ currentStep }) {
    const containerW = window.innerWidth;
    const containerH = window.innerHeight - 90;

    let baseW, baseH;
    if (containerW / containerH > SVG_ASPECT) {
        baseW = containerW;
        baseH = containerW / SVG_ASPECT;
    } else {
        baseH = containerH;
        baseW = containerH * SVG_ASPECT;
    }

    const scale = 1 + (currentStep - 1) * BG_STEP_SCALE;
    const bgW = Math.round(baseW * scale);
    const bgH = Math.round(baseH * scale);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgSvg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${bgW}px ${bgH}px`,
            backgroundPosition: 'center center',
            pointerEvents: 'none',
            zIndex: 0,
        }} />
    );
}

// Stable nodeTypes — defined at module level so ReactFlow never re-mounts nodes
const nodeTypes = {
    orgSimple: OrgNode,
    card: NodeCard,
};

// First 2 steps = HIghLevel zoom positions (0.11 then 1.0)
// Steps 3+ = HoldingWithPost depth levels (all at zoom 1.0)
const HIGH_LEVEL_STEPS = 2;
const ZOOM_OUT = 0.11;
const ZOOM_IN = 0.9;

function getTargetZoom(step) {
    return step === 1 ? ZOOM_OUT : ZOOM_IN;
}

function OrgChartContent({ data, isLoading, isError }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView, setViewport, getZoom, getViewport, getNodes } = useReactFlow();

    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(HIGH_LEVEL_STEPS + 1);
    const [sliderValue, setSliderValue] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomDirection, setZoomDirection] = useState('in');
    const [openNodeId, setOpenNodeId] = useState(null);

    const highLevelCacheRef = useRef(null);
    const postDepthCacheRef = useRef({});
    const initializedRef = useRef(false);
    const hoveredNodeIdRef = useRef(null);
    const containerRef = useRef(null);
    const reactFlowWrapperRef = useRef(null);
    const zoomTimerRef = useRef(null);
    const wheelTimeoutRef = useRef(null);
    const pendingDirRef = useRef(null);

    // Build all caches when data loads
    useEffect(() => {
        if (!data || data.length === 0) {
            setNodes([]);
            setEdges([]);
            initializedRef.current = false;
            return;
        }

        try {
            const hlTree = buildHighLevelTree(data);
            const { nodes: hlNodes, edges: hlEdges } = layoutHighLevelTree(hlTree);
            const hlEdgesClean = hlEdges.map(e => ({ ...e, markerEnd: undefined }));
            highLevelCacheRef.current = { nodes: hlNodes, edges: hlEdgesClean };

            const fullTree = buildCombinedTree(data);
            const maxDepth = getMaxAvailableDepth(fullTree);
            const total = HIGH_LEVEL_STEPS + maxDepth;
            setTotalSteps(total);

            const cache = {};
            for (let depth = 1; depth <= maxDepth; depth++) {
                const filtered = filterTreeByDepth(fullTree, depth);
                const { nodes: pNodes, edges: pEdges } = layoutCombinedTree(filtered);
                cache[depth] = { nodes: pNodes, edges: pEdges.map(e => ({ ...e, markerEnd: undefined })) };
            }
            postDepthCacheRef.current = cache;

            setCurrentStep(1);
            setSliderValue(0);
            setNodes(hlNodes);
            setEdges(hlEdgesClean);
            initializedRef.current = false;
        } catch (err) {
            console.error('CombinedSchema error:', err);
        }
    }, [data, setNodes, setEdges]);

    // Initial fitView on first data render
    useEffect(() => {
        if (nodes.length > 0 && !initializedRef.current) {
            initializedRef.current = true;
            const t = setTimeout(() => {
                fitView({ duration: 0, padding: 0.2 });
            }, 100);
            return () => clearTimeout(t);
        }
    }, [nodes.length, fitView]);

    // Track which node the mouse is hovering over
    const onNodeMouseEnter = useCallback((_, node) => {
        hoveredNodeIdRef.current = node.id;
    }, []);

    const stepToPercent = useCallback((step) => {
        if (totalSteps <= 1) return 0;
        return ((step - 1) / (totalSteps - 1)) * 100;
    }, [totalSteps]);

    const percentToStep = useCallback((percent) => {
        return Math.round((percent / 100) * (totalSteps - 1)) + 1;
    }, [totalSteps]);

    const changeStep = useCallback((newStep) => {
        if (newStep < 1 || newStep > totalSteps) return;
        if (newStep === currentStep) return;

        const direction = newStep > currentStep ? 'in' : 'out';
        const nextZoom = getTargetZoom(newStep);

        // 1. Запоминаем экранную позицию узла под мышкой ДО перестроения графа
        const targetNodeId = hoveredNodeIdRef.current;
        let targetScreenPos = null;
        if (targetNodeId) {
            const currentNode = getNodes().find(n => n.id === targetNodeId);
            const viewport = getViewport();
            const bounds = reactFlowWrapperRef.current?.getBoundingClientRect();
            if (currentNode && viewport && bounds) {
                targetScreenPos = {
                    x: currentNode.position.x * viewport.zoom + viewport.x + bounds.width / 2,
                    y: currentNode.position.y * viewport.zoom + viewport.y + bounds.height / 2,
                };
            }
        }

        // 2. Запускаем оверлей и перестраиваем граф
        if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);

        setIsZooming(false);
        requestAnimationFrame(() => {
            setZoomDirection(direction);
            setIsZooming(true);

            requestAnimationFrame(() => {
                setCurrentStep(newStep);
                setSliderValue(stepToPercent(newStep));
                setOpenNodeId(null);

                if (newStep <= HIGH_LEVEL_STEPS) {
                    const cache = highLevelCacheRef.current;
                    if (cache) { setNodes(cache.nodes); setEdges(cache.edges); }
                } else {
                    const postDepth = newStep - HIGH_LEVEL_STEPS;
                    const cache = postDepthCacheRef.current[postDepth];
                    if (cache) { setNodes(cache.nodes); setEdges(cache.edges); }
                }

                // 3. После рендера позиционируем так, чтобы узел остался под мышкой
                setTimeout(() => {
                    if (targetScreenPos && targetNodeId) {
                        const newNode = getNodes().find(n => n.id === targetNodeId);
                        const bounds = reactFlowWrapperRef.current?.getBoundingClientRect();
                        if (newNode && bounds) {
                            setViewport(
                                {
                                    x: targetScreenPos.x - bounds.width / 2 - newNode.position.x * nextZoom,
                                    y: targetScreenPos.y - bounds.height / 2 - newNode.position.y * nextZoom,
                                    zoom: nextZoom,
                                },
                                { duration: 0 }
                            );
                        } else {
                            // Узел не найден в новом графе — fallback
                            setViewport({ x: 0, y: 0, zoom: nextZoom }, { duration: 0 });
                        }
                    } else {
                        // Нет узла под мышкой
                        if (newStep === 1) {
                            fitView({ duration: 0, padding: 0.2 });
                        } else {
                            setViewport({ x: 0, y: 0, zoom: nextZoom }, { duration: 0 });
                        }
                    }
                }, 50);
            });
        });

        zoomTimerRef.current = setTimeout(() => setIsZooming(false), 800);
    }, [currentStep, totalSteps, stepToPercent, setNodes, setEdges, getNodes, getViewport, setViewport, fitView]);

    const handleIncrease = useCallback(() => {
        if (currentStep < totalSteps) changeStep(currentStep + 1);
    }, [currentStep, totalSteps, changeStep]);

    const handleDecrease = useCallback(() => {
        if (currentStep > 1) changeStep(currentStep - 1);
    }, [currentStep, changeStep]);


    const handleSliderChange = useCallback((e) => {
        const percent = Number(e.target.value);
        const newStep = percentToStep(percent);
        setSliderValue(stepToPercent(newStep));
        if (newStep !== currentStep) changeStep(newStep);
    }, [percentToStep, stepToPercent, currentStep, changeStep]);

    // Колёсико мыши — дебаунс 100ms, шаг 1
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e) => {
            e.preventDefault();
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
            pendingDirRef.current = e.deltaY < 0 ? 1 : -1;
            wheelTimeoutRef.current = setTimeout(() => {
                if (pendingDirRef.current === 1) handleIncrease();
                else handleDecrease();
                pendingDirRef.current = null;
            }, 100);
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
            if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
        };
    }, [handleIncrease, handleDecrease]);

    const scalePercent = Math.round((currentStep / totalSteps) * 100);

    if (isLoading) {
        return <div className={styles.messageContainer}><div className={styles.loader}>Загрузка...</div></div>;
    }
    if (isError) {
        return <div className={styles.messageContainer}><div className={styles.error}>Ошибка загрузки</div></div>;
    }
    if (!data || data.length === 0) {
        return <div className={styles.messageContainer}><div className={styles.empty}>Нет данных</div></div>;
    }

    return (
        <NodeExpansionContext.Provider value={{ openNodeId, setOpenNodeId, wrapperRef: reactFlowWrapperRef }}>
        <div className={styles.container} ref={containerRef}>
            <ScaledBackground currentStep={currentStep} />
            {isZooming && (
                <div className={`${styles.zoomOverlay} ${zoomDirection === 'in' ? styles.zoomIn : styles.zoomOut}`} />
            )}

            <div ref={reactFlowWrapperRef} style={{ width: '100%', height: '100%' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeMouseEnter={onNodeMouseEnter}
                    fitView={false}
                    minZoom={0.1}
                    maxZoom={1}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={true}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    preventScrolling={false}
                    defaultEdgeOptions={{ type: 'step', style: { stroke: '#CCCCCC', strokeWidth: 5 } }}
                    proOptions={{ hideAttribution: true }}
                >
                    <MiniMap nodeColor="#CCCCCC" maskColor="rgba(0, 0, 0, 0.05)" />
                </ReactFlow>
            </div>

            <div className={styles.depthSliderContainer}>
                <div className={styles.sliderRow}>
                    <button
                        onClick={handleDecrease}
                        className={styles.sliderButton}
                        disabled={currentStep <= 1}
                    >−</button>
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
                        onClick={handleIncrease}
                        className={styles.sliderButton}
                        disabled={currentStep >= totalSteps}
                    >+</button>
                </div>
                <div className={styles.sliderValue}>{scalePercent}%</div>
            </div>
        </div>
        </NodeExpansionContext.Provider>
    );
}

export default function OrgChart(props) {
    return (
        <ReactFlowProvider>
            <OrgChartContent {...props} />
        </ReactFlowProvider>
    );
}
