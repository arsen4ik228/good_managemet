import { useLocation } from "react-router-dom";
import { usePanelPreset } from './usePanelPreset'
import { useRightPanel } from './useRightPanel'

const PRESETS_NAMES = {
    policy: 'POLICIES',
    posts: 'POSTS',
    statistics: 'STATISTICS',
    goal: 'GOAL',
    helper: 'HELPER',
    chat: 'CHATS'
}

const map = new Map(Object.entries(PRESETS_NAMES))


export const useSetPresets = () => {
    const { PRESETS } = useRightPanel();
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(Boolean);
    let presetName

    for (let i = pathParts.length - 1; i >= 0; i--) {
        const preset = map.get(pathParts[i])

        if (preset) {
            presetName = preset
            break;
        }
    }
    console.error(PRESETS[presetName])
    usePanelPreset(PRESETS[presetName])
}