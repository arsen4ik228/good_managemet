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
      providesTags: (result) =>
        result?.currentObjective
          ? [{ type: "Objective", id: result.currentObjective.id }, "Objective"]
          : ["Objective"],
    }),

    updateObjective: build.mutation({
      query: (body) => ({
        url: `objectives/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Objective', id: arg._id }],
    }),
  }),
});

export const { useGetObjectiveIdQuery, useUpdateObjectiveMutation } =
  objectiveApi;
