import apiSlice from "./api";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProject: build.query({
      query: ({ organizationId }) => ({
        url: `projects/${organizationId}/projects`,
      }),
      transformResponse: (response) => {
    // Находим максимальный projectNumber среди всех элементов
    let maxProjectNumber = 0;
    
    if (Array.isArray(response)) {
        response.forEach(item => {
            if (item.projectNumber && item.projectNumber > maxProjectNumber) {
                maxProjectNumber = item.projectNumber;
            }
        });
    }

    return {
        maxProjectNumber, // Добавляем максимальный номер в результат
        
        projects:
            response?.filter((item) => {
                if (item.type !== "Проект" || item.programId !== null)
                    return false;

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
                    return hasProductType;
                }
            }) || [],

        programs:
            response?.filter((item) => {
                if (item.type !== "Программа") return false;
                if (Array.isArray(item.targets)) {
                    const hasProductType = item.targets.some(
                        (target) =>
                            (target.type === "Продукт" &&
                                target.targetState === "Активная") ||
                            target.targetState === "Черновик" ||
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
                type: "Project",
                id,
              })),
              "Project",
            ]
          : ["Project"],
    }),

    getProjectId: build.query({
      query: ({ projectId }) => ({
        url: `projects/${projectId}`,
      }),
      transformResponse: (response) => {
        //("getProjectId   ", response);
        const arrayTasks = response?.project?.targets.reduce((acc, target) => {
          // Ищем уже существующую группу по type
          let group = acc.find((g) => g.title === target.type);

          // Создаем объект задачи
          const taskObj = {
            task: target.content,
            date: target.dateStart
              ? new Date(target.dateStart).toLocaleDateString("ru-RU")
              : "",
            people:
              target.targetHolders?.map((h) => h.post?.postName).join(", ") ||
              "",
            post:
              target.targetHolders
                ?.map((h) => h.post?.divisionName)
                .join(", ") || "",
            holderPostId: target.holderPostId,
            id: target.id,
            targetState: target.targetState,
            deadline: target.deadline,
            dateComplete: target.dateComplete,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,
            isExpired: target.isExpired,
            // можно добавить любые другие поля из target
          };

          if (group) {
            group.tasks.push(taskObj);
          } else {
            acc.push({
              title: target.type,
              tasks: [taskObj],
            });
          }

          return acc;
        }, []);

        // console.log(arrayTasks);

        return {
          currentProject: response.project || {},
          strategy: response.project?.strategy || {},
          targets: arrayTasks,
          strategies: response?.strategies || [],
        };
      },
      providesTags: (result, error, arg) => [
        { type: "Project", id: arg.projectId },
      ],
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
    }),

    getProjectNew: build.query({
      query: ({ organizationId }) => ({
        url: `projects/${organizationId}/new`,
      }),
      transformResponse: (response) => {
        // console.log(response); // Отладка ответа
        return {
          posts: response?.posts || [],
          strategies: response?.strategies || [],
          programs: response?.programs || [],
        };
      },
      providesTags: ["Project"],
    }),

    updateProject: build.mutation({
      query: ({ projectId, holderProductPostId, ...body }) => {
        const queryParams = new URLSearchParams();
        if (holderProductPostId != null) {
          // Добавляем параметр, только если он не null/undefined
          queryParams.append("holderProductPostId", holderProductPostId);
        }
        return {
          url: `projects/${projectId}/update/?${queryParams.toString()}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (result, err, arg) => [
        { type: "Project", id: arg._projectId },
      ],
    }),

    getProgramNew: build.query({
      query: ({ organizationId }) => ({
        url: `/projects/${organizationId}/program/new`,
      }),
      transformResponse: (response) => {
        //(response); // Отладка ответа
        return {
          posts: response?.posts || [],
          strategies: response?.strategies || [],
          projects: response?.projects || [],
        };
      },
      providesTags: ["Project"],
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
      providesTags: (result, error, arg) => [
        { type: "Project", id: arg.programId },
      ],
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
