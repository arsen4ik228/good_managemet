import apiSlice from "./api";

export const controlPanelApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllControlPanel: build.query({
      query: ({ organizationId }) => ({
        url: `controlPanels/${organizationId}`,
      }),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result?.map(({ id }) => ({
                type: "ControlPanel",
                id,
              })),
              "ControlPanel",
            ]
          : ["ControlPanel"],
    }),

    postControlPanel: build.mutation({
      query: (body) => ({
        url: `controlPanels/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ControlPanel"],
    }),

    deleteControlPanel: build.mutation({
      query: ({ controlPanelId }) => ({
        url: `controlPanels/${controlPanelId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: ["ControlPanel"],
    }),

    updateControlPanel: build.mutation({
      query: ({ id, ...body }) => ({
        url: `controlPanels/${id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "ControlPanel", id: arg.id },
         { type: 'StatisticsInControlPanel', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllControlPanelQuery,
  useDeleteControlPanelMutation,
  usePostControlPanelMutation,
  useUpdateControlPanelMutation,
} = controlPanelApi;
