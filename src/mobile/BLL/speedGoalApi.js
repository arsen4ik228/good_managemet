import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";
import {prepareHeaders} from "./Function/prepareHeaders.js"


export const speedGoalApi = createApi({
  reducerPath: "speedSpeedGoalApi",
  tagTypes: ["SpeedGoal"],
  baseQuery: fetchBaseQuery({ baseUrl,prepareHeaders }),
  endpoints: (build) => ({

    getSpeedGoalId: build.query({
      query: ({strategyId}) => ({
        url: `objectives/${strategyId}/objective`,
      }),
      transformResponse: (response) => {
        console.log('getSpeedGoalId   ', response)
        // const isArchive = response?.strategy.state === 'Завершено' ? true : false
        return {
          currentSpeedGoal: response || {},
          // isArchive
        };
      },
      providesTags: (result, error, { strategyId }) =>
        result ? [{ type: "SpeedGoal", id: strategyId }] : [],
    }),

    updateSpeedGoal: build.mutation({
      query: (body) => ({
        url: `objectives/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { objectiveId, strategId }) => [
        { type: "SpeedGoal", id: objectiveId }, // Обновляем текущую цель
        { type: "SpeedGoal", id: strategId },   // Обновляем стратегию для getSpeedGoalId
        { type: "SpeedGoal", id: "LIST" },      // Обновляем список
      ],
    }),
  }),
});

export const {
  useGetSpeedGoalIdQuery,
  useUpdateSpeedGoalMutation,
} = speedGoalApi;
