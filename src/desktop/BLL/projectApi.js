import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./baseUrl";
import {prepareHeaders} from "./Function/prepareHeaders.js"
export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Project", "Project1"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getProject: build.query({
      query: ({ userId, organizationId }) => ({
        url: `${userId}/projects/${organizationId}/projects`,
      }),
      transformResponse: (response) => {
        return {
          projects:
            response?.filter((item) => {
              if (item.type !== "Проект" || item.programId !== null)
                return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    target.targetState === "Активная" &&
                    target.isExpired === false
                );
                return hasProductType;
              }
              return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
            }) || [],

          archivesProjects:
            response?.filter((item) => {
              if (item.type !== "Проект" || item.programId !== null)
                return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    (target.targetState === "Завершена" ||
                      target.isExpired === true)
                );
                return hasProductType;
              }
              return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
            }) || [],

          projectsWithProgram:
            response?.filter((item) => {
              if (item.type !== "Проект" || item.programId === null)
                return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    target.targetState === "Активная" &&
                    target.isExpired === false
                );

                return hasProductType;
              }
              return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
            }) || [],

          archivesProjectsWithProgram:
            response?.filter((item) => {
              if (item.type !== "Проект" || item.programId === null)
                return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    (target.targetState === "Завершена" ||
                      target.isExpired === true)
                );

                return hasProductType;
              }
              return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
            }) || [],

          programs:
            response?.filter((item) => {
              if (item.type !== "Программа") return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    target.targetState === "Активная" &&
                    target.isExpired === false
                );
                return hasProductType;
              }
              return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
            }) || [],

          archivesPrograms:
            response?.filter((item) => {
              if (item.type !== "Программа") return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    (target.targetState === "Завершена" ||
                      target.isExpired === true)
                );
                return hasProductType;
              }
              return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
            }) || [],
        };
      },
      providesTags: (result) =>
        result ? [{ type: "Project", id: "LIST" }] : [],
    }),

    postProject: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/projects/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Project", id: "LIST" }] : [],
    }),

    getProjectNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects/new`,
      }),
      transformResponse: (response) => {
        return {
          workers: response?.workers || [],
          strategies: response?.strategies || [],
          organizations: response?.organizations || [],
          programs: response?.programs || [],
        };
      },
    }),

    getProjectId: build.query({
      query: ({ userId, projectId }) => ({
        url: `${userId}/projects/${projectId}`,
      }),
      transformResponse: (response) => {
        console.log(response);
        const _targets = response?.project?.targets
          .map(
            ({
              targetHolders,
              dateComplete,
              createdAt,
              updatedAt,
              ...rest
            }) => ({ ...rest })
          )
          .filter((item) => item.targetState !== "Отменена");
        return {
          currentProject: response?.project || {},
          targets: _targets || [],
        };
      },
      providesTags: (result, error, { projectId }) =>
        result ? [{ type: "Project1", id: projectId }] : [],
    }),

    updateProject: build.mutation({
      query: ({ userId, projectId, ...body }) => ({
        url: `${userId}/projects/${projectId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => {   
        return result
          ? [
              { type: "Project1", id: projectId },
              { type: "Project1", id: "LIST" },
              { type: "Project", id: "LIST" },
            ]
          : [];
      },
    }),
    

    // Программы
    getProgramNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects/program/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          projects: response?.projects || [],
          workers: response?.workers || [],
          strategies: response?.strategies || [],
          organizations: response?.organizations || [],
        };
      },
      providesTags: (result) =>
        result ? [{ type: "Project1", id: "LIST" }, { type: "Project", id: "LIST" }] : [],
    }),

    getProgramId: build.query({
      query: ({ userId, programId }) => ({
        url: `${userId}/projects/${programId}/program`,
      }),
      transformResponse: (response) => {
        const _targets = response?.program?.targets
          .map(
            ({
              targetHolders,
              dateComplete,
              createdAt,
              updatedAt,
              ...rest
            }) => ({ ...rest })
          )
          .filter((item) => item.targetState !== "Отменена");
        return {
          response: response,
          currentProgram: response?.program || {},
          currentProjects: response?.projects || [],
          targets: _targets || [],
        };
      },
      providesTags: (result, error, { programId }) =>
        result ? [{ type: "Project1", id: programId }] : [],
    }),
  }),
});

export const {
  useGetProjectQuery,
  useGetProjectNewQuery,
  usePostProjectMutation,
  useGetProjectIdQuery,
  useUpdateProjectMutation,
  useGetProgramNewQuery,
  useGetProgramIdQuery,
} = projectApi;
