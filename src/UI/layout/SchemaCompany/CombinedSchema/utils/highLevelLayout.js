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

function calculateSubtreeWidth(node, nodeWidth, nodeSpacing) {
    if (!node.children || node.children.length === 0) return nodeWidth;

    let totalWidth = 0;
    node.children.forEach(child => {
        totalWidth += calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
    });
    totalWidth += (node.children.length - 1) * nodeSpacing;
    return totalWidth;
}

export function layoutTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 180;
    const nodeWidth = 200;
    const nodeHeight = 60;
    const nodeSpacing = 100;
    const horizontalMargin = 50;

    function positionNode(node, depth, left) {
        const subtreeWidth = calculateSubtreeWidth(node, nodeWidth, nodeSpacing);
        const x = left + subtreeWidth / 2;
        const y = depth * levelHeight;

        nodes.push({
            id: String(node.id),
            type: 'orgSimple',
            position: { x, y },
            data: { label: node.organizationName || node.name || 'Без названия' },
            style: { width: nodeWidth, minHeight: nodeHeight },
        });

        let childLeft = left;
        node.children.forEach((child) => {
            const childWidth = calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
            positionNode(child, depth + 1, childLeft);
            childLeft += childWidth + nodeSpacing;

            edges.push({
                id: `hl-${node.id}-${child.id}`,
                source: String(node.id),
                target: String(child.id),
                type: 'step',
                animated: false,
                style: { stroke: '#CCCCCC', strokeWidth: 5 },
            });
        });
    }

    let globalLeft = horizontalMargin;
    tree.forEach((root) => {
        const rootWidth = calculateSubtreeWidth(root, nodeWidth, nodeSpacing);
        positionNode(root, 0, globalLeft);
        globalLeft += rootWidth + nodeSpacing * 2;
    });

    return { nodes, edges };
}
