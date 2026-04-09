// utils/treeLayout.js

export function buildTree(data) {
    const orgMap = {};
    const roots = [];

    // Создаём организации
    data.forEach((item) => {
        orgMap[item.id] = { 
            ...item, 
            type: 'organization',
            children: []
        };
    });

    // Строим связи между организациями
    data.forEach((item) => {
        if (item.parentOrganizationId && orgMap[item.parentOrganizationId]) {
            orgMap[item.parentOrganizationId]._childOrganizations = orgMap[item.parentOrganizationId]._childOrganizations || [];
            orgMap[item.parentOrganizationId]._childOrganizations.push(orgMap[item.id]);
        } else if (!item.parentOrganizationId) {
            roots.push(orgMap[item.id]);
        }
    });

    // Для каждой организации строим дерево постов
    Object.values(orgMap).forEach(org => {
        const postsTree = buildPostsTree(org.posts || [], org.id);
        org.children = postsTree;
    });

    return roots;
}

function buildPostsTree(posts, organizationId) {
    if (!posts || posts.length === 0) return [];
    
    const postsMap = {};
    const postRoots = [];

    posts.forEach(post => {
        postsMap[post.id] = {
            ...post,
            type: 'post',
            organizationId: organizationId,
            children: []
        };
    });

    posts.forEach(post => {
        if (post.parentId && postsMap[post.parentId]) {
            postsMap[post.parentId].children.push(postsMap[post.id]);
        } else if (!post.parentId) {
            postRoots.push(postsMap[post.id]);
        }
    });

    return postRoots;
}

// Рассчитывает ширину поддерева с учётом ВСЕХ потомков (и постов, и организаций)
function calculateTotalWidth(node, nodeWidth, nodeSpacing) {
    if (node.type === 'post') {
        // Для поста - только ширина его дочерних постов
        if (!node.children || node.children.length === 0) {
            return nodeWidth;
        }
        
        let totalWidth = 0;
        node.children.forEach(child => {
            totalWidth += calculateTotalWidth(child, nodeWidth, nodeSpacing);
        });
        totalWidth += (node.children.length - 1) * nodeSpacing;
        
        return Math.max(totalWidth, nodeWidth);
    } else {
        // Для организации - максимум из ширины постов и ширины дочерних организаций
        let postsWidth = nodeWidth;
        if (node.children && node.children.length > 0) {
            postsWidth = 0;
            node.children.forEach(child => {
                postsWidth += calculateTotalWidth(child, nodeWidth, nodeSpacing);
            });
            postsWidth += (node.children.length - 1) * nodeSpacing;
            postsWidth = Math.max(postsWidth, nodeWidth);
        }
        
        let orgsWidth = 0;
        if (node._childOrganizations && node._childOrganizations.length > 0) {
            node._childOrganizations.forEach(org => {
                orgsWidth += calculateTotalWidth(org, nodeWidth, nodeSpacing);
            });
            orgsWidth += (node._childOrganizations.length - 1) * nodeSpacing * 2; // Двойной отступ между организациями
        }
        
        return Math.max(postsWidth, orgsWidth, nodeWidth);
    }
}

export function layoutTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 180;
    const nodeWidth = 300;
    const nodeHeight = 90;
    const nodeSpacing = 100;
    const horizontalMargin = 50;

    function positionNode(node, depth = 0, left = 0, right = 0) {
        // Используем новую функцию для расчёта полной ширины
        const totalWidth = calculateTotalWidth(node, nodeWidth, nodeSpacing);
        
        let x = left + totalWidth / 2;
        const y = depth * levelHeight;

        const isPost = node.type === 'post';
        const nodeData = {
            id: node.id,
            type: 'custom',
            position: { x, y },
            data: isPost ? getPostNodeData(node) : getOrgNodeData(node),
            style: {
                width: nodeWidth,
                minHeight: nodeHeight,
            },
        };

        nodes.push(nodeData);

        // Позиционируем дочерние посты
        let maxDepth = depth;
        
        if (node.children && node.children.length > 0) {
            // Для постов и организаций - центрируем дочерние элементы
            let childrenWidth = 0;
            node.children.forEach(child => {
                childrenWidth += calculateTotalWidth(child, nodeWidth, nodeSpacing);
            });
            childrenWidth += (node.children.length - 1) * nodeSpacing;
            
            let childLeft = x - childrenWidth / 2;
            
            node.children.forEach((child) => {
                const childWidth = calculateTotalWidth(child, nodeWidth, nodeSpacing);
                
                const childNode = positionNode(child, depth + 1, childLeft, childLeft + childWidth);
                maxDepth = Math.max(maxDepth, childNode.depth);
                
                childLeft += childWidth + nodeSpacing;

                edges.push({
                    id: `${node.id}-${child.id}`,
                    source: node.id,
                    target: child.id,
                    type: "step",
                    animated: false,
                    style: {
                        stroke: "#CCCCCC",
                        strokeWidth: 5,
                    },
                });
            });
        }

        // Если это организация и у неё есть дочерние организации
        if (node.type === 'organization' && node._childOrganizations && node._childOrganizations.length > 0) {
            // Дочерние организации идут после всех постов
            const orgsDepth = maxDepth + 1;
            
            // Вычисляем общую ширину дочерних организаций
            let totalOrgsWidth = 0;
            node._childOrganizations.forEach(org => {
                totalOrgsWidth += calculateTotalWidth(org, nodeWidth, nodeSpacing);
            });
            totalOrgsWidth += (node._childOrganizations.length - 1) * nodeSpacing * 2; // Увеличенный отступ
            
            // Центрируем дочерние организации относительно родительской организации
            let orgsLeft = x - totalOrgsWidth / 2;
            
            node._childOrganizations.forEach((org) => {
                const orgWidth = calculateTotalWidth(org, nodeWidth, nodeSpacing);
                
                positionNode(org, orgsDepth, orgsLeft, orgsLeft + orgWidth);
                
                orgsLeft += orgWidth + nodeSpacing * 2; // Увеличенный отступ между организациями

                // Прямое ребро от организации к дочерней организации
                edges.push({
                    id: `${node.id}-${org.id}`,
                    source: node.id,
                    target: org.id,
                    type: "step",
                    animated: false,
                    style: {
                        stroke: "#CCCCCC",
                        strokeWidth: 5,
                    },
                });
            });
        }

        return { ...nodeData, depth: maxDepth };
    }

    if (tree.length > 0) {
        let globalLeft = horizontalMargin;

        tree.forEach((root) => {
            const rootWidth = calculateTotalWidth(root, nodeWidth, nodeSpacing);
            positionNode(root, 0, globalLeft, globalLeft + rootWidth);
            globalLeft += rootWidth + nodeSpacing * 3; // Большой отступ между корневыми организациями
        });
    }

    return { nodes, edges };
}

function getOrgNodeData(org) {
    const topPost = org.posts?.find(p => !p.parentId) || org.posts?.[0];
    
    return {
        label: org.organizationName || 'Без названия',
        userName: topPost?.user 
            ? `${topPost.user.firstName || ''} ${topPost.user.secondName || ''}`.trim() 
            : null,
        postName: topPost?.postName || null,
        avatarUrl: topPost?.user?.avatar_url || null,
        isOrganization: true,
        original: org
    };
}

function getPostNodeData(post) {
    return {
        label: post.postName || 'Без названия',
        userName: post.user 
            ? `${post.user.firstName || ''} ${post.user.secondName || ''}`.trim() 
            : null,
        postName: post.postName || null,
        avatarUrl: post.user?.avatar_url || null,
        isOrganization: false,
        divisionName: post.divisionName,
        original: post
    };
}