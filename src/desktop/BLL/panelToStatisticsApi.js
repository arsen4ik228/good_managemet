
import apiSlice from './api'

export const panelToStatisticsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    panelToStatisticsUpdateOrderNumbers: build.mutation({
      query: (body) => ({
        url: `/panelToStatistics/updateOrderNumbers`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Panel", id: "LIST" }],
    }),
  }),
});

export const { usePanelToStatisticsUpdateOrderNumbersMutation } =
panelToStatisticsApi;
