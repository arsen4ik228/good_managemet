import { configureStore } from '@reduxjs/toolkit';
// import { policyApi } from './policyApi';
import { policyApi } from '../../mobile/BLL/policyApi';
import { goalApi } from './goalApi';
import { objectiveApi } from './objectiveApi';
// import { postApi } from './postApi';
import { postApi } from '../../mobile/BLL/postApi';
import { projectApi } from './projectApi';
import { strategyApi } from './strategy/strategyApi';
import { statisticsApi } from './statisticsApi';
import { directoriesApi } from './directoriesApi';
import { organizationApi } from './organizationApi';


import  apiSlice  from './api';

import { controlPanelApi } from './controlPanel/controlPanelApi';
import { targetsApi } from '../../mobile/BLL/targetsApi';
import { convertApi } from '../../mobile/BLL/convertApi';
import { fileApi } from './fileApi';


import localStorageReducer from "./localStorage/localStorageSlice";
import postReducer from "./postSlice";
import projectReducer from "./Project/Slice/projectSlice";
import programReducer from "./Program/Slice/programSlice";


export const desktopStore = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
        [objectiveApi.reducerPath]: objectiveApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [strategyApi.reducerPath]: strategyApi.reducer,
        [statisticsApi.reducerPath]: statisticsApi.reducer,
        [directoriesApi.reducerPath]: directoriesApi.reducer,
        [organizationApi.reducerPath]: organizationApi.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [convertApi.reducerPath]: convertApi.reducer,
        [targetsApi.reducerPath]: targetsApi.reducer,

        localStorage: localStorageReducer,
        post: postReducer,
        project: projectReducer,
        program: programReducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware()                                                       
        .concat(policyApi.middleware)
        .concat(goalApi.middleware)
        .concat(objectiveApi.middleware)
        .concat(postApi.middleware)
        .concat(projectApi.middleware)
        .concat(strategyApi.middleware)
        .concat(statisticsApi.middleware)
        .concat(directoriesApi.middleware)
        .concat(organizationApi.middleware)
        .concat(apiSlice.middleware)
        .concat(convertApi.middleware)
        .concat(targetsApi.middleware)

});
export default desktopStore;