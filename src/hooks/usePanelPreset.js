// hooks/usePanelPreset.js
import { useEffect } from 'react';
import { useRightPanel } from './useRightPanel';
import { useLocation } from 'react-router-dom';

export const usePanelPreset = (presetKey, cleanup = true) => {
    const { setPanelPreset, resetRightPanel } = useRightPanel();

    // В вашем компоненте добавьте:
    const location = useLocation();

    // console.log('presetKey    ', presetKey, ' | Current path:', location.pathname);
    useEffect(() => {
        setPanelPreset(presetKey);
        // console.warn('usePanelPreset   ', presetKey)
        return () => {
            if (cleanup) {
                resetRightPanel();
            }
        };
    }, [presetKey, cleanup]);
};