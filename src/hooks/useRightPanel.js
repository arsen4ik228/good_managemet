import { useDispatch, useSelector } from 'react-redux';
import { 
    updateRightPanel, 
    setPanelPreset, 
    resetRightPanel, 
    updatePanelProps,
    setPresetConfig,
    selectRightPanel,
    selectActivePreset 
} from '../store/slices/panels.slice';

export const useRightPanel = () => {
    const dispatch = useDispatch();
    const rightPanel = useSelector(selectRightPanel);
    const activePreset = useSelector(selectActivePreset);

    const updatePanel = (componentType, props = {}) => {
        dispatch(updateRightPanel({ componentType, props }));
    };

    const setPreset = (presetKey) => {
        //('use right panel setPreset() ', presetKey ) 
        dispatch(setPanelPreset(presetKey));
    };

    const resetPanel = () => {
        dispatch(resetRightPanel());
    };
    
    const updateProps = (props) => {
        dispatch(updatePanelProps({ props }));
    };
    
    const configurePreset = (presetKey, config) => {
        dispatch(setPresetConfig({ presetKey, config }));
    };

    return {
        // Actions
        updateRightPanel: updatePanel,
        setPanelPreset: setPreset,
        resetRightPanel: resetPanel,
        updatePanelProps: updateProps,
        configurePreset,
        
        // State
        rightPanel,
        activePreset,
        
        // Preset keys
        PRESETS: {
            HELPER: 'helper',
            GOAL: 'goal',
            POSTS: 'posts',
            POLICIES: 'policies',
            STATISTICS: 'statistics',
            CHATS: 'chats',
            USERS: 'users',
            WORKINGPLAN: 'workingPlan',
            STRATEGY: 'strategy',
            PROJECT: 'project',
            PROJECTSANDPROGRAMS: 'projectsAndPrograms',
        }
    };
};