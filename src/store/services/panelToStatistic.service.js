
import apiSlice from './api'

export const panelToStatisticsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    panelToStatisticsUpdateOrderNumbers: build.mutation({
      query: (body) => ({
        url: `/panelToStatistics/updateOrderNumbers`,
        method: "PATCH",
        body,
      }),
      // invalidatesTags: (result, err, arg) => [{ type: 'ControlPanel', id: arg.id }],
    }),
  }),
});

export const { usePanelToStatisticsUpdateOrderNumbersMutation } =
panelToStatisticsApi;
