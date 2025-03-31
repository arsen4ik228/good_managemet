import apiSlice from "./api";

export const projectApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
    getProject: build.query({
      query: ({organizationId}) => ({
        url: `projects/${organizationId}/projects`,
      }),
      transformResponse: (response) => {
        console.log('getProject    ',response); // Отладка ответа
        return {
          projects: response?.filter(item => {
            if (item.type !== 'Проект' || item.programId !== null) return false;

            if (Array.isArray(item.targets)) {
              const hasProductType = item.targets.some(target => target.type === "Продукт" && target.targetState === "Активная" && target.isExpired === false);
              return hasProductType;
            }
            return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
          }) || [],

          archivesProjects: response?.filter(item => {
            if (item.type !== 'Проект' || item.programId !== null) return false;

            if (Array.isArray(item.targets)) {
              const hasProductType = item.targets.some(target => target.type === "Продукт" && (target.targetState === "Завершена" || target.isExpired === true));
              return hasProductType;
            }
            return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
          }) || [],

          projectsWithProgram: response?.filter(item => {
            if (item.type !== 'Проект' || item.programId === null) return false;

            if (Array.isArray(item.targets)) {
              const hasProductType = item.targets.some(target => target.type === "Продукт" && target.targetState === "Активная" && target.isExpired === false);
              console.log(hasProductType)
              return hasProductType;
            }
            return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
          }) || [],

          archivesProjectsWithProgram: response?.filter(item => {
            if (item.type !== 'Проект' || item.programId === null) return false;

            if (Array.isArray(item.targets)) {
              const hasProductType = item.targets.some(target => target.type === "Продукт" && (target.targetState === "Завершена" || target.isExpired === true));
              console.log(hasProductType)
              return hasProductType;
            }
            return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
          }) || [],

          programs: response?.filter(item => {
            if (item.type !== 'Программа') return false;

            if (Array.isArray(item.targets)) {
              const hasProductType = item.targets.some(target => target.type === "Продукт" && target.targetState === "Активная" && target.isExpired === false);
              return hasProductType;
            }
            return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
          }) || [],

          archivesPrograms: response?.filter(item => {
            if (item.type !== 'Программа') return false;

            if (Array.isArray(item.targets)) {
              const hasProductType = item.targets.some(target => target.type === "Продукт" && (target.targetState === "Завершена" || target.isExpired === true));
              return hasProductType;
            }
            return true; // Если targets отсутствует или не массив, возвращаем элемент по умолчанию
          }) || [],
        }
      },
      providesTags: (result) => result ? [{ type: 'Project', id: "LIST" }] : [],
    }),

    getProgramNew: build.query({
      query: ({organizationId}) => ({
        url: `/projects/${organizationId}/program/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          posts: response?.posts || [],
          strategies: response?.strategies || [],
          projects: response?.projects || [],
        };
      },
    }),

    postProject: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/projects/new`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id
      }),
      invalidatesTags: (result) => result ? [{ type: 'Project', id: "LIST" }] : [],
    }),

    getProjectNew: build.query({
      query: ({organizationId}) => ({
        url: `/projects/${organizationId}/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          posts: response?.posts || [],
          strategies: response?.strategies || [],
          programs: response?.programs || [],
        };
      },
    }),

    getProjectId: build.query({
      query: ({ userId, projectId }) => ({
        url: `${userId}/projects/${projectId}`,
      }),
      transformResponse: (response) => {
        console.log('getProjectId   ', response)
        return {
          currentProject: response.project || {},
          targets: response?.project?.targets?.filter(item => item.targetState !== 'Отменена') || [],
          strategies: response?.strategies || []
        }
      },
      providesTags: (result, error, { projectId }) => result ? [{ type: "Project1", id: projectId }] : []
    }),

    getProgramId: build.query({
      query: ({ userId, programId }) => ({
        url: `${userId}/projects/${programId}/program`,
      }),
      transformResponse: (response) => ({
        currentProgram: response?.program || {},
        currentProjects: response?.projects || [],
        targets: response?.program?.targets || []
      }),
      providesTags: (result, error, { programId }) => result ? [{ type: "Project1", id: programId }] : []
    }),

    updateProject: build.mutation({
      query: ({ userId, projectId, ...body }) => ({
        url: `${userId}/projects/${projectId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => result ? [{ type: "Project1", id: projectId }] : []
    }),
  }),
});

export const { useGetProjectQuery, useGetProgramIdQuery, useGetProgramNewQuery, useGetProjectNewQuery, usePostProjectMutation, useGetProjectIdQuery, useUpdateProjectMutation } = projectApi;
