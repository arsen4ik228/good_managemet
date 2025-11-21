import React from 'react';
// import Bey from '../store/slices/Bey';
import PostsList from '../UI/Custom/PresetComponents/PostsList';
import StatisticsList from '../UI/Custom/PresetComponents/StatisticsList/StatisticsList';
import PoliciesList from '../UI/Custom/PresetComponents/PoliciesList/PoliciesList';
import ConvertList from '../UI/Custom/PresetComponents/ConvertsList/ConvertList';
import UsersList from '../UI/Custom/PresetComponents/UsersList/UsersList';
import WorlingPlanList from '../UI/Custom/PresetComponents/WorlingPlanList/WorlingPlanList';
// import GoalsPanel from '../components/GoalsPanel';

const componentMap = {
    // helper: Bey,
    // goals: GoalsPanel,
    posts: PostsList,
    policies: PoliciesList,
    statistics: StatisticsList,
    chats: ConvertList,
    users: UsersList,
    workingPlan: WorlingPlanList
    // добавьте другие компоненты
};

export default function RightPanelMapper({ componentType, props }) {
    if (!componentType) return null;
    
    const Component = componentMap[componentType];
    
    if (!Component) {
        console.warn(`Component type "${componentType}" not found in componentMap`);
        return null;
    }
    
    return <Component {...props} />;
}