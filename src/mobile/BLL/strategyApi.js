import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"
import {selectedOrganizationId} from '../BLL/constans.js'

export const strategyApi = createApi({
    reducerPath: "strategy",
    tagTypes: ["Strategy"],
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    endpoints: (build) => ({
        getStrategy: build.query({
            query: () => ({
                url: `strategies/${selectedOrganizationId}`,
            }),
            transformResponse: (response) => {
                console.log('getstrategy:    ', response)
                const strategies = response
                strategies?.sort((a, b) => {
                    const stateA = a.state || '';
                    const stateB = b.state || '';

                    if (stateA === 'Черновик' && stateB !== 'Черновик') return -1;
                    if (stateB === 'Черновик' && stateA !== 'Черновик') return 1;

                    if (stateA === 'Активный' && stateB !== 'Активный') return -1;
                    if (stateB === 'Активный' && stateA !== 'Активный') return 1;

                    return 0;
                });

                const activeAndDraftStrategies = strategies.filter(strategy =>
                    strategy.state === 'Активный' || strategy.state === 'Черновик'
                );

                const otherStrategies = strategies.filter(strategy =>
                    strategy.state !== 'Активный' && strategy.state !== 'Черновик'
                );

                const activeStrategyId = activeAndDraftStrategies.find(item => item.state === 'Активный')?.id

                return {
                    activeAndDraftStrategies: activeAndDraftStrategies,
                    archiveStrategies: otherStrategies,
                    activeStrategyId: activeStrategyId,
                };
            },

            providesTags: (result) => result ? [{ type: "Strateg", id: "LIST" }] : [],
        }),

        getStrategyId: build.query({
            query: ({ strategyId }) => ({
                url: `strategies/${strategyId}/strategy`,
            }),
            transformResponse: (response) => {
                console.log(response)
                return {
                    currentStrategy: response || []
                }
            },

            // Добавляем теги для этой query
            providesTags: (result, error, { strategyId }) => result ? [{ type: "Strateg1", id: strategyId }] : []
        }),

        updateStrategy: build.mutation({
            query: (body) => ({
                url: `strategies/${body._id}/update`,
                method: "PATCH",
                body,
            }),
            // Обновляем теги, чтобы перезагрузить getStrategiesId
            invalidatesTags: (result, error, { strategyId }) => result ? [{ type: "Strateg1", id: strategyId }, { type: "Strateg", id: "LIST" }] : []
        }),

        postStrategy: build.mutation({
            query: (body) => ({
                url: `strategies/new`,
                method: "POST",
                body: {
                    content: ' ',
                    organizationId: selectedOrganizationId,
                },
            }),
            transformResponse: (response) => ({
                id: response.id
            }),
            invalidatesTags: (result) => result ? [{ type: "Strateg", id: "LIST" }] : []
        }),
    })
})

export const {
    useGetStrategyQuery,
    useGetStrategyIdQuery,
    useUpdateStrategyMutation,
    usePostStrategyMutation,
} = strategyApi;