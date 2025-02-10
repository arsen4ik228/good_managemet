import apiSlice from "./api";

export const strategyApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
    getStrategies: build.query({
      query: ({organizationId}) => ({
        url: `strategies/${organizationId}`,
      }),
      transformResponse: (response) => {
        const archiveStrategies = response
          ?.filter((item) => item.state === "Завершено")
          .sort((a, b) => b.strategyNumber - a.strategyNumber);

        const activeAndDraftStrategies = response
          ?.filter(
            (item) => item.state === "Активный" || item.state === "Черновик"
          )
          .sort((a, b) => {
            if (a.state === "Черновик" && b.state === "Активный") return -1;
            if (a.state === "Активный" && b.state === "Черновик") return 1;
            return 0;
          });

        const hasDraftStrategies = response?.some(
          (item) => item.state === "Черновик"
        );

        const activeStrategyId = response?.find(
          (item) => item.state === "Активный"
        )?.id;

        return {
          archiveStrategies: archiveStrategies,
          activeAndDraftStrategies: activeAndDraftStrategies,
          activeStrategyId: activeStrategyId,
          hasDraftStrategies: hasDraftStrategies,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.archiveStrategies || []).map(({ id }) => ({
                type: 'Strategy',
                id,
              })),
              'Strategy',
              ...(result.activeAndDraftStrategies || []).map(({ id }) => ({
                type: 'Strategy',
                id,
              })),
              'Strategy',
            ]
          : ['Strategy'],
    }),

    getStrategyId: build.query({
      query: ({ strategyId }) => ({
        url: `strategies/${strategyId}/strategy`,
      }),
      transformResponse: (response) =>  ({
        currentStrategy: response || {},
        currentStrategyState: response.state || "",
      }),
      providesTags: (result, err, arg) => [{ type: 'Strategy', id: arg.strategyId }],
    }),

// Илья body другое postStrategy
    postStrategy: build.mutation({
      query: (body) => ({
        url: `strategies/new`,
        method: "POST",
        body
      }),
      transformResponse: (response) => ({
        id: response.id,
      }),
      invalidatesTags:["Strategy"],
    }),

    updateStrategy: build.mutation({
      query: (body) => ({
        url: `strategies/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Strategy', id: arg._id }],
    }),
  }),
});

export const {
  usePostStrategyMutation,
  useGetStrategiesQuery,
  useGetStrategyIdQuery,
  useUpdateStrategyMutation,
} = strategyApi;
