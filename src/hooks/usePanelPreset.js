// hooks/usePanelPreset.js
import { useEffect } from 'react';
import { useRightPanel } from './useRightPanel';

export const usePanelPreset = (presetKey, cleanup = true) => {
    const { setPanelPreset, resetRightPanel } = useRightPanel();

    useEffect(() => {
        setPanelPreset(presetKey);

        return () => {
            if (cleanup) {
                resetRightPanel();
            }
        };
    }, [presetKey, cleanup]);
};