import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  right: {
    componentType: null, // Тип компонента ('helper', 'goals', etc.)
    props: {}, // Пропсы для компонента
    preset: null,
  },
  presets: {
    helper: {
      componentType: "helper",
      props: {},
    },
    posts: {
      componentType: "posts",
      props: {},
    },
    policies: {
      componentType: "policies",
      props: {},
    },
    statistics: {
      componentType: "statistics",
      props: {},
    },
    chats: {
      componentType: "chats",
      props: {},
    },
    // goals: {
    //     componentType: 'goals',
    //     props: {}
    // }
  },
};

const panelsSlice = createSlice({
  name: "panels",
  initialState,
  reducers: {
    updateRightPanel: (state, action) => {
      state.right = {
        ...state.right,
        ...action.payload,
        preset: null,
      };
    },

    setPanelPreset: (state, action) => {
      const presetKey = action.payload;
      const preset = state.presets[presetKey];

      if (preset) {
        state.right = {
          componentType: preset.componentType,
          props: preset.props,
          preset: presetKey,
        };
      }
    },

    resetRightPanel: (state) => {
      state.right = initialState.right;
    },

    updatePanelProps: (state, action) => {
      const { props } = action.payload;
      state.right.props = { ...state.right.props, ...props };
    },

    setPresetConfig: (state, action) => {
      const { presetKey, config } = action.payload;
      if (state.presets[presetKey]) {
        state.presets[presetKey] = { ...state.presets[presetKey], ...config };
      }
    },
  },
});

export const selectRightPanel = (state) =>
  state.panels?.right || initialState.right;
export const selectActivePreset = (state) =>
  state.panels?.right?.preset || null;

export const {
  updateRightPanel,
  setPanelPreset,
  resetRightPanel,
  updatePanelProps,
  setPresetConfig,
} = panelsSlice.actions;

export default panelsSlice.reducer;
