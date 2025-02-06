
import apiSlice from "./api";

export const goalApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getGoal: build.query({
      query: ({ organizationId }) => ({
        url: `goals/${organizationId}`,
      }),

      transformResponse: (response) => {
        console.log('getGoal    ', response)
        return {
          currentGoal: response || {},
        };
      },
      providesTags: (result) =>
        result?.currentGoal
          ? [{ type: "Goal", id: result.currentGoal.id }, "Goal"]
          : ["Goal"],
    }),

    postGoal: build.mutation({
      query: (body) => ({
        url: `goals/new`,
        method: "POST",
        body
      }),
      invalidatesTags: ["Goal"],
    }),

    updateGoal: build.mutation({
      query: (body) => ({
        url: `goals/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Goal', id: arg._id }],
    }),
  }),
});

export const { useGetGoalQuery, usePostGoalMutation, useUpdateGoalMutation } =
  goalApi;
