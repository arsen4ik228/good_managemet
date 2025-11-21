import apiSlice from "./api";



export const policyApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
   
    getPolicies: build.query({
      query: ({ organizationId }) => ({
        url: `policies/${organizationId}`,
      }),

      transformResponse: (response) => {
        //("getPolicies    ", response);
        const directivesDB = response.directives;
        const instructionsDB = response.instructions;
        const disposalsDB = response.disposals;
        const sharedArray = [...directivesDB, ...instructionsDB, ...disposalsDB]

        const sortArray = (array) =>
          array.sort((a, b) => {
            if (a.policyName < b.policyName) return -1;
            if (a.policyName > b.policyName) return 1;
            return 0;
          });

        const sortedDirectives = sortArray(directivesDB);
        const sortedInstructions = sortArray(instructionsDB);
        const sortedDisposals = sortArray(disposalsDB);

        const activeDirectives = sortedDirectives.filter(
          (item) => item.state === "Активный"
        );
        const draftDirectives = sortedDirectives.filter(
          (item) => item.state === "Черновик"
        );
        const archiveDirectives = sortedDirectives.filter(
          (item) => item.state === "Отменён"
        );

        const activeInstructions = sortedInstructions.filter(
          (item) => item.state === "Активный"
        );
        const draftInstructions = sortedInstructions.filter(
          (item) => item.state === "Черновик"
        );
        const archiveInstructions = sortedInstructions.filter(
          (item) => item.state === "Отменён"
        );

          const activeDisposals = sortedDisposals.filter(
          (item) => item.state === "Активный"
        );
        const draftDisposals = sortedDisposals.filter(
          (item) => item.state === "Черновик"
        );
        const archiveDisposals = sortedDisposals.filter(
          (item) => item.state === "Отменён"
        );

        return {
          activeDirectives: activeDirectives,
          draftDirectives: draftDirectives,
          archiveDirectives: archiveDirectives,
          activeInstructions: activeInstructions,
          draftInstructions: draftInstructions,
          archiveInstructions: archiveInstructions, 
          sharedArray: sharedArray,
          //Валера
          directivesActive: activeDirectives,
          directivesDraft: draftDirectives,
          directivesCompleted: archiveDirectives,

          instructionsActive: activeInstructions,
          instructionsDraft: draftInstructions,
          instructionsCompleted: archiveInstructions,

          disposalsActive: activeDisposals,
          disposalsDraft: draftDisposals,
          disposalsCompleted: archiveDisposals,

         
        };
      },

      providesTags: (result) =>
        result
          ? [
            ...result?.sharedArray.map(({ id }) =>
            ({
              type: 'Policy',
              id,
            }
            )),
            'Policy',
          ]
          : ['Policy'],
    }),

    getPoliciesId: build.query({
      query: ({ policyId }) => ({
        url: `policies/${policyId}/policy`,
      }),
      transformResponse: (response) => {
        //(response); // Отладка ответа
        return {
          currentPolicy: response || {},
        };
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyId }) =>
        result ? [{ type: "Policy", id: policyId }] : [],
    }),

    postPolicies: build.mutation({
      query: (body) => ({
        url: `policies/new`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id,
      }),
      invalidatesTags: ["Policy"],
    }),

    updatePolicies: build.mutation({
      query: (body) => ({
        url: `policies/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Policy', id: arg._id }],
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
} = policyApi;
