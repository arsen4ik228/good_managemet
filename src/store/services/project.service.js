import apiSlice from "./api";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProject: build.query({
      query: ({ organizationId }) => ({
        url: `projects/${organizationId}/projects`,
      }),
      transformResponse: (response) => {
        console.log("getProject    ", response); // Отладка ответа
        return {
          projects:
            response?.filter((item) => {
              if (item.type !== "Проект" || item.programId !== null)
                return false;

              // if (Array.isArray(item.targets)) {
              //   const hasProductType = item.targets.some(
              //     (target) =>
              //       target.type === "Продукт" &&
              //       target.targetState === "Активная" &&
              //       target.isExpired === false
              //   );

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                  (target.targetState === "Активная" ||
                    target.targetState === "Черновик")
                );
                return hasProductType;
              }
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
            }) || [],

          projectsWithProgram:
            response?.filter((item) => {
              if (item.type !== "Проект" || item.programId === null)
                return false;

              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                  (target.targetState === "Активная" ||
                    target.targetState === "Черновик")
                );
                console.log(hasProductType);
                return hasProductType;
              }
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
                console.log(hasProductType);
                return hasProductType;
              }
            }) || [],

          programs:
            response?.filter((item) => {
              if (item.type !== "Программа") return false;
      ;
              if (Array.isArray(item.targets)) {
                const hasProductType = item.targets.some(
                  (target) =>
                    target.type === "Продукт" &&
                    target.targetState === "Активная" || target.targetState === "Черновик" ||
                    target.isExpired === false
                );
                return hasProductType;
              }
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
            }) || [],
        };
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result?.map(({ id }) => ({
                type: 'Project',
                id,
              })),
              'Project',
            ]
          : ['Project'],
    }),

    getProjectId: build.query({
      query: ({ projectId }) => ({
        url: `projects/${projectId}`,
      }),
      transformResponse: (response) => {
        console.log("getProjectId   ", response);
        return {
          currentProject: response.project || {},
          targets:
            response?.project?.targets?.filter(
              (item) => item.targetState !== "Отменена"
            ) || [],
          strategies: response?.strategies || [],
        };
      },
      providesTags: (result, error, arg) => [{ type: 'Project', id: arg.projectId }],
    }),

    postProject: build.mutation({
      query: (body) => ({
        url: `projects/new`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id,
      }),
      invalidatesTags: ["Project"],
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled; // Ждём успешного выполнения
      //     const projectId = data.id; // Получаем id из ответа
    
      //     // Используем projectApi вместо api
      //     dispatch(
      //       projectApi.endpoints.getProjectId.initiate({ projectId })
      //     );
      //     console.log("пипец ggggggggggggggggggggggggggggggg");
      //   } catch (error) {
      //     console.error("Ошибка при автоматическом запросе getProjectId:", error);
      //   }
      // },
    }),

    getProjectNew: build.query({
      query: ({ organizationId }) => ({
        url: `projects/${organizationId}/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          posts: response?.posts || [],
          strategies: response?.strategies || [],
          programs: response?.programs || [],
        };
      },
      providesTags: ['Project'],
    }),

    updateProject: build.mutation({
      query: ({ projectId, holderProductPostId, ...body }) => {
        const queryParams = new URLSearchParams();
        if (holderProductPostId != null) {  // Добавляем параметр, только если он не null/undefined
          queryParams.append('holderProductPostId', holderProductPostId);
        }
        return {
          url: `projects/${projectId}/update/?${queryParams.toString()}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (result, err, arg) => [{ type: 'Project', id: arg._projectId }],
    }),

    getProgramNew: build.query({
      query: ({ organizationId }) => ({
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
      providesTags: ['Project'],
    }),

    getProgramId: build.query({
      query: ({ programId }) => ({
        url: `projects/${programId}/program`,
      }),
      transformResponse: (response) => ({
        currentProgram: response?.program || {},
        currentProjects: response?.projects || [],
        targets: response?.program?.targets || [],
      }),
      providesTags: (result, error, arg) => [{ type: 'Project', id: arg.programId }],
    }),
  }),
});

export const {
  useGetProjectQuery,
  useGetProgramIdQuery,
  useGetProgramNewQuery,
  useGetProjectNewQuery,
  usePostProjectMutation,
  useGetProjectIdQuery,
  useUpdateProjectMutation,
} = projectApi;
