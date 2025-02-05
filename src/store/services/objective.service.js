import apiSlice from "./api";

export const objectiveApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getObjectiveId: build.query({
      query: ({ strategyId }) => ({
        url: `objectives/${strategyId}/objective`,
      }),
      transformResponse: (response) => {
        console.log(response);
        return {
          currentObjective: response || {},
        };
      },
      providesTags: [{ type: "Objective", id: "LIST" }],
    }),

    updateObjective: build.mutation({
      query: (body) => ({
        url: `objectives/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Objective", id: "LIST" }],
    }),
  }),
});

export const { useGetObjectiveIdQuery, useUpdateObjectiveMutation } =
  objectiveApi;
