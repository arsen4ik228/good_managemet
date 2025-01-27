import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"
import {selectedOrganizationId} from './constans.js'

export const policyApi = createApi({
  reducerPath: "policy",
  tagTypes: ["Policy"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders}),
  endpoints: (build) => ({
    getPolicies: build.query({
      query: ({organizationId}) => ({
        url: `policies/${organizationId}`,
      }),

      transformResponse: (response) => {
        console.log('getPolicies    ', response)
        const directivesDB = response.directives;
        const instructionsDB = response.instructions

        const sortArray = (array) => array.sort((a, b) => {
          if (a.policyName < b.policyName) return -1;
          if (a.policyName > b.policyName) return 1;
          return 0;
      });

      const sortedDirectives = sortArray(directivesDB)
      const sortedInstructions = sortArray(instructionsDB)
  
      const activeDirectives = sortedDirectives.filter(item => item.state === 'Активный')
      const draftDirectives = sortedDirectives.filter(item => item.state === 'Черновик')
      const archiveDirectives = sortedDirectives.filter(item => item.state === 'Отменён')
  
      const activeInstructions = sortedInstructions.filter(item => item.state === 'Активный')
      const draftInstructions = sortedInstructions.filter(item => item.state === 'Черновик')
      const archiveInstructions = sortedInstructions.filter(item => item.state === 'Отменён')

        

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
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Policy", id })),
              { type: "Policy", id: "LIST" },
            ]
          : [{ type: "Policy", id: "LIST" }],
    }),

    postPolicies: build.mutation({
      query: () => ({
        url: `policies/new`,
        method: "POST",
        body: {
          policyName: 'Политика',
          content: ' ',
          organizationId: selectedOrganizationId,
        },
      }), 
      transformResponse: (response) => ({
        id: response.id
    }),
      invalidatesTags: [{ type: "Policy", id: "LIST" }],
    }),


    getPoliciesId: build.query({
      query: ({policyId}) => ({
        url: `policies/${policyId}/policy`,
      }),
      transformResponse: (response) => {
        console.log('getPoliciesId   ',response); // Отладка ответа
        return {
          currentPolicy: response || {},
        };
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyId }) =>
        result ? [{ type: "Policy", id: policyId }] : [],
    }),

    updatePolicies: build.mutation({
      query: (body) => ({
        url: `policies/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      // Обновляем теги, чтобы перезагрузить getPoliciesId
      invalidatesTags: (result, error, { policyId }) => [
        { type: "Policy", id: policyId }, {type: "Policy", id: "LIST" }
      ],
    }),

    postImage: build.mutation({
      query: ({ userId, formData }) => ({
        url: `${userId}/file-upload/upload`,
        method: "POST",
        body: formData,
      }),
    }),

  }),
});

export const {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
  usePostImageMutation,
} = policyApi;
