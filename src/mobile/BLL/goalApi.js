import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl, selectedOrganizationId} from "./constans";
import {prepareHeaders} from "./Function/prepareHeaders.js"


export const goalApi = createApi({
  reducerPath: "goal",
  tagTypes: ["Goal"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  endpoints: (build) => ({

    getGoal: build.query({
      query: () => ({
        url: `goals/${selectedOrganizationId}`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentGoal: response || {},
        };
      },
      providesTags: [{type: "Goal", id: "LIST" }],
    }),
   
    postGoal: build.mutation({
      query: ({...body }) => ({
        url: `goals/new`,
        method: "POST",
        body: {
          ...body,
          organizationId: selectedOrganizationId
        },
      }),
      invalidatesTags: [{ type: "Goal", id: "LIST" }],
    }),

    updateGoal: build.mutation({
      query: (body) => ({
        url: `goals/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      // Обновляем теги, чтобы перезагрузить getGoal и getGoalId
      invalidatesTags: [
        { type: "Goal", id: "LIST" }, // обновляет общий список целей
      ],
    }),
  }),
});

export const {
  useGetGoalQuery,
  useUpdateGoalMutation,
  usePostGoalMutation,
} = goalApi;
