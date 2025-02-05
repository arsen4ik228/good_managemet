import apiSlice from "./api";

import { selectedOrganizationId } from "./baseUrl";


export const policyApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
    // getPolicies: build.query({
    //   query: ({organizationId}) => ({
    //     url: `policies/${organizationId}`,
    //   }),

    //   transformResponse: (response) => {
    //     const directivesActive = response.directives
    //       .filter((item) => item.state === "Активный")
    //       .sort((a, b) => a.policyName.localeCompare(b.policyName));

    //     const directivesDraft = response.directives
    //       .filter((item) => item.state === "Черновик")
    //       .sort((a, b) => a.policyName.localeCompare(b.policyName));

    //     const directivesCompleted = response.directives
    //       .filter((item) => item.state === "Отменён")
    //       .sort((a, b) => a.policyName.localeCompare(b.policyName));

    //     const instructionsActive = response.instructions
    //       .filter((item) => item.state === "Активный")
    //       .sort((a, b) => a.policyName.localeCompare(b.policyName));

    //     const instructionsDraft = response.instructions
    //       .filter((item) => item.state === "Черновик")
    //       .sort((a, b) => a.policyName.localeCompare(b.policyName));

    //     const instructionsCompleted = response.instructions
    //       .filter((item) => item.state === "Отменён")
    //       .sort((a, b) => a.policyName.localeCompare(b.policyName));

    //     return {
    //       directives: response.directives || [],
    //       instructions: response.instructions || [],

    //       directivesActive: directivesActive || [],
    //       directivesDraft: directivesDraft || [],
    //       directivesCompleted: directivesCompleted || [],

    //       instructionsActive: instructionsActive || [],
    //       instructionsDraft: instructionsDraft || [],
    //       instructionsCompleted: instructionsCompleted || [],
    //     };
    //   },

    //   providesTags: (result) =>
    //     result && Array.isArray(result)
    //       ? [
    //           ...result.map(({ id }) => ({ type: "Policy", id })),
    //           { type: "Policy", id: "LIST" },
    //         ]
    //       : [{ type: "Policy", id: "LIST" }],
    // }),

    getPolicies: build.query({
      query: ({ organizationId }) => ({
        url: `policies/${organizationId}`,
      }),

      transformResponse: (response) => {
        console.log("getPolicies    ", response);
        const directivesDB = response.directives;
        const instructionsDB = response.instructions;

        const sortArray = (array) =>
          array.sort((a, b) => {
            if (a.policyName < b.policyName) return -1;
            if (a.policyName > b.policyName) return 1;
            return 0;
          });

        const sortedDirectives = sortArray(directivesDB);
        const sortedInstructions = sortArray(instructionsDB);

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

        return {
          activeDirectives: activeDirectives,
          draftDirectives: draftDirectives,
          archiveDirectives: archiveDirectives,
          activeInstructions: activeInstructions,
          draftInstructions: draftInstructions,
          archiveInstructions: archiveInstructions,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result?.data.map(({ id }) => ({
                type: 'Policy',
                id,
              })),
              'Policy',
            ]
          : ['Policy'],
    }),

    getPoliciesId: build.query({
      query: ({ policyId }) => ({
        url: `policies/${policyId}/policy`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentPolicy: response || {},
        };
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyId }) =>
        result ? [{ type: "Policy", id: policyId }] : [],
    }),

    // postPolicies: build.mutation({
    //   query: (body) => ({
    //     url: `policies/new`,
    //     method: "POST",
    //     body
    //   }),
    //   invalidatesTags: [{ type: "Policy", id: "LIST" }],
    // }),

    postPolicies: build.mutation({
      query: () => ({
        url: `policies/new`,
        method: "POST",
        body: {
          policyName: "Политика",
          content: " ",
          organizationId: selectedOrganizationId,
        },
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

    // postImage: build.mutation({
    //   query: ({ userId, formData }) => ({
    //     url: `${userId}/file-upload/upload`,
    //     method: "POST",
    //     body: formData,
    //   }),
    // }),
  }),
});

export const {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
  usePostImageMutation,
} = policyApi;
