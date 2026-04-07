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
            orgMap[item.parentOrganizationId].children.push(orgMap[item.id]);
        } else if (!item.parentOrganizationId) {
            roots.push(orgMap[item.id]);
        }
    });

    // Для каждой организации строим дерево постов
    Object.values(orgMap).forEach(org => {
        const postsTree = buildPostsTree(org.posts || [], org.id);
        
        // Сохраняем дочерние организации
        const childOrgs = [...org.children];
        
        // Добавляем посты как детей организации
        org.children = postsTree;
        
        // Если есть дочерние организации, добавляем их к самому глубокому посту
        if (childOrgs.length > 0) {
            const deepestLeaf = getDeepestLeaf(org);
            if (deepestLeaf) {
                deepestLeaf.children = [...deepestLeaf.children, ...childOrgs];
            } else {
                org.children = [...org.children, ...childOrgs];
            }
        }
    });

    return roots;
}

function getDeepestLeaf(node) {
    if (!node.children || node.children.length === 0) {
        return node;
    }
    
    let deepestNode = null;
    let maxDepth = -1;
    
    function findDeepest(node, depth) {
        if (!node.children || node.children.length === 0) {
            return { node, depth };
        }
        
        let deepest = { node, depth };
        node.children.forEach(child => {
            const result = findDeepest(child, depth + 1);
            if (result.depth > deepest.depth) {
                deepest = result;
            }
        });
        return deepest;
    }
    
    node.children.forEach(child => {
        const result = findDeepest(child, 1);
        if (result.depth > maxDepth) {
            maxDepth = result.depth;
            deepestNode = result.node;
        }
    });
    
    return deepestNode || node;
}

function buildPostsTree(posts, organizationId) {
    if (!posts || posts.length === 0) return [];
    
    const postsMap = {};
    const postRoots = [];

    // Первый проход: создаём все узлы постов
    posts.forEach(post => {
        postsMap[post.id] = {
            ...post,
            type: 'post',
            organizationId: organizationId,
            children: []
        };
    });

    // Второй проход: строим иерархию по parentId
    posts.forEach(post => {
        if (post.parentId && postsMap[post.parentId]) {
            // Добавляем как дочерний к родительскому посту
            postsMap[post.parentId].children.push(postsMap[post.id]);
        } else if (!post.parentId) {
            // Корневые посты (без parentId)
            postRoots.push(postsMap[post.id]);
        }
    });

    return postRoots;
}

function calculateSubtreeWidth(node, nodeWidth, nodeSpacing) {
    if (!node.children || node.children.length === 0) {
        return nodeWidth;
    }

    let totalWidth = 0;
    node.children.forEach(child => {
        totalWidth += calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
    });

    totalWidth += (node.children.length - 1) * nodeSpacing;

    return Math.max(totalWidth, nodeWidth);
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
        const subtreeWidth = calculateSubtreeWidth(node, nodeWidth, nodeSpacing);
        
        let x = left + (subtreeWidth / 2);
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
                    strokeWidth: 5,
                },
            });
        });

        return nodeData;
    }

    if (tree.length > 0) {
        let globalLeft = horizontalMargin;

        tree.forEach((root) => {
            const rootWidth = calculateSubtreeWidth(root, nodeWidth, nodeSpacing);
            positionNode(root, 0, globalLeft, globalLeft + rootWidth);
            globalLeft += rootWidth + nodeSpacing * 2;
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