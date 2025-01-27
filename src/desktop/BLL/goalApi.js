import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./baseUrl";
import { prepareHeaders } from "./Function/prepareHeaders.js";

export const goalApi = createApi({
  reducerPath: "goalApi",
  tagTypes: ["Goal"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getGoal: build.query({
      query: ({ organizationId }) => ({
        url: `goals/${organizationId}`,
      }),

      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentGoal: response || {},
        };
      },
      providesTags: [{ type: "Goal", id: "LIST" }],
    }),

    postGoal: build.mutation({
      query: (body) => ({
        url: `goals/new`,
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Goal", id: "LIST" }],
    }),

    updateGoal: build.mutation({
      query: (body) => ({
        url: `goals/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Goal", id: "LIST" }],
    }),
  }),
});

export const { useGetGoalQuery, usePostGoalMutation, useUpdateGoalMutation } =
  goalApi;
