import apiSlice from "./api";


export const policyDirectoriesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPolicyDirectories: build.query({
      query: ({organizationId}) => ({
        url: `policyDirectory/${organizationId}`,
      }),
      transformResponse: (response) => {
        //Валерка
        const foldersSort = response?.map((element) => ({
          ...element,
          policyToPolicyDirectories: element.policyToPolicyDirectories
            ?.sort((a, b) =>
              a?.policy?.policyName.localeCompare(b?.policy?.policyName)
            )
            ?.sort((a, b) => {
              if (
                a?.policy?.type === "Директива" &&
                b?.policy?.type !== "Директива"
              ) {
                return -1;
              }
              if (
                a?.policy?.type !== "Директива" &&
                b?.policy?.type === "Директива"
              ) {
                return 1;
              }
              return 0;
            }),
        }));
        //("foldersSort     ", foldersSort);
        //Илюша
        //("getPolicyDirectories     ", response);
        let Data = [];
        if (Array.isArray(response) && response.length > 0) {
          Data = response.map((item) => ({
            id: item.id,
            directoryName: item.directoryName,
            policies: item.policyToPolicyDirectories.flatMap(
              (elem) => elem.policy
            ),
          }));
        }

        return {
          folders: response || [],
          foldersSort: foldersSort,
          mobileData: Data,
        };
      },
      providesTags: result =>
        result
          ? [
              ...result?.folders.map(({ id }) => ({
                type: 'Directory',
                id,
              })),
              'Directory',
            ]
          : ['Directory'],
    }),

    getPolicyDirectoriesId: build.query({
      query: ({ organizationId, policyDirectoryId }) => ({
        url: `policyDirectory/${organizationId}/${policyDirectoryId}/policyDirectory`,
      }),
      transformResponse: (response) => {
        //("getPolicyDirectoriesId     ", response);
        const Data = {
          id: response?.policyDirectory?.id,
          directoryName: response?.policyDirectory?.directoryName,
          policies:
            response?.policyDirectory?.policyToPolicyDirectories?.flatMap(
              (elem) => elem.policy
            ),
        };

        return {
          activeDirectives: response?.directives || [],
          activeInstructions: response?.instructions || [],
          policyDirectory: Data || [],
          data: response || [],
        };
      },
      // Добавляем теги для этой query
      providesTags: (result, err, arg) => [{ type: 'Directory', id: arg.policyDirectoryId }],
    }),

    postPolicyDirectories: build.mutation({
      query: (body) => ({
        url: `policyDirectory/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ['Directory'],
    }),

    updatePolicyDirectories: build.mutation({
      query: ({ policyDirectoryId, ...body }) => ({
        url: `/policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Directory', id: arg.policyDirectoryId }],
    }),

    deletePolicyDirectories: build.mutation({
      query: ({ policyDirectoryId }) => ({
        url: `policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags:['Directory'],
    }),
  }),
});

export const {
  useGetPolicyDirectoriesQuery,
  useGetPolicyDirectoriesIdQuery,
  usePostPolicyDirectoriesMutation,
  useDeletePolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation,
} = policyDirectoriesApi;
