/**
 * Преобразование массива в дерево
 */
export function buildTree(data) {
    const map = {};
    const roots = [];

    data.forEach((item) => {
        map[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
        if (item.parentOrganizationId && map[item.parentOrganizationId]) {
            map[item.parentOrganizationId].children.push(map[item.id]);
        } else if (!item.parentOrganizationId) {
            roots.push(map[item.id]);
        }
    });

    return roots;
}

/**
 * Расчет ширины поддерева
 */
function calculateSubtreeWidth(node, nodeWidth, nodeSpacing) {
    if (!node.children || node.children.length === 0) {
        return nodeWidth;
    }
    
    let totalWidth = 0;
    node.children.forEach(child => {
        totalWidth += calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
    });
    
    totalWidth += (node.children.length - 1) * nodeSpacing;
    
    return totalWidth;
}

/**
 * Раскладка дерева с прямыми линиями под 90 градусов
 */
export function layoutTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 180;
    const nodeWidth = 200;
    const nodeHeight = 60;
    const nodeSpacing = 100;
    const horizontalMargin = 50;

    function positionNode(node, depth = 0, left = 0, right = 0) {
        const subtreeWidth = calculateSubtreeWidth(node, nodeWidth, nodeSpacing);
        
        let x = left + (subtreeWidth / 2);
        const y = depth * levelHeight;

        const currentNode = {
            id: node.id,
            position: { x, y },
            data: { 
                label: node.organizationName || node.name || 'Без названия',
                original: node 
            },
            style: {
                padding: "12px 16px",
                border: `2px solid #CCCCCC`,
                borderRadius: 8,
                background: "#CCCCCC", // серый фон как у линий
                width: nodeWidth,
                minHeight: nodeHeight,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 500,
                color: "#000000",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                wordBreak: "break-word",
                lineHeight: 1.4,
                letterSpacing: "0.2px",
            },
        };
        
        nodes.push(currentNode);

        let childLeft = left;
        
        node.children.forEach((child, index) => {
            const childWidth = calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
            
            positionNode(child, depth + 1, childLeft, childLeft + childWidth);
            
            childLeft += childWidth + nodeSpacing;
            
            edges.push({
                id: `${node.id}-${child.id}`,
                source: node.id,
                target: child.id,
                type: "step",
                animated: false,
                style: { 
                    stroke: "#CCCCCC", 
                    strokeWidth: 5, // толщина линии 5px
                },
            });
        });

        return currentNode;
    }

    if (tree.length > 0) {
        let globalLeft = horizontalMargin;
        
        tree.forEach((root, index) => {
            const rootWidth = calculateSubtreeWidth(root, nodeWidth, nodeSpacing);
            positionNode(root, 0, globalLeft, globalLeft + rootWidth);
            globalLeft += rootWidth + nodeSpacing * 2;
        });
    }

    return { nodes, edges };
}