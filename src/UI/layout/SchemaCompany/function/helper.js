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
        if (item.parentOrganizationId) {
            map[item.parentOrganizationId]?.children.push(map[item.id]);
        } else {
            roots.push(map[item.id]);
        }
    });

    return roots;
}

/**
 * Раскладка дерева (очень простая, но работает)
 */

export function layoutTree(tree) {
    const nodes = [];
    const edges = [];

    let xOffset = 0;

    function traverse(node, depth = 0) {
        const x = xOffset * 200;
        const y = depth * 150;

        nodes.push({
            id: node.id,
            position: { x, y },
            data: { label: node.organizationName },
            style: {
                padding: 10,
                border: "1px solid #999",
                borderRadius: 8,
                background: "#fff",
                width: 150,
                textAlign: "center",
                fontSize: 12,
            },
        });

        if (node.children.length === 0) {
            xOffset++;
        }

        node.children.forEach((child) => {
            edges.push({
                id: `${node.id}-${child.id}`,
                source: node.id,
                target: child.id,
            });

            traverse(child, depth + 1);
        });
    }

    tree.forEach((root) => traverse(root));

    return { nodes, edges };
}