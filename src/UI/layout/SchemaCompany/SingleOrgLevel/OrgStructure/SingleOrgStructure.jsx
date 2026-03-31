import React from 'react';
import { useParams } from 'react-router-dom';
import { useAllPosts } from '@hooks';
import PostOrgChart from './PostOrgChart';
import styles from './SIngleOrgStructure.module.css'; // добавил .module.css

export default function SingleOrgStructure() {
    const { orgId } = useParams();
    const { allPosts, isLoading, isError } = useAllPosts({ 
        organization: orgId, 
        structure: true 
    });

    console.log('Posts data:', allPosts);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Структура организации</h1>
            <PostOrgChart 
                data={allPosts}
                isLoading={isLoading}
                isError={isError}
                orgId={orgId}
            />
        </div>
    );
}