import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url, selectedOrganizationId} from "./baseUrl"
import {prepareHeaders} from "./Function/prepareHeaders.js"


export const policyApi = createApi({
  reducerPath: "policyApi",
  tagTypes: ["Policy"],
  baseQuery: fetchBaseQuery({
    baseUrl: url, 
    prepareHeaders
  }),
  endpoints: (build) => ({
    getPolicies: build.query({
      query: ({organizationId}) => ({
        url: `policies/${organizationId}`,
      }),

      transformResponse: (response) => {
        const directivesActive = response.directives
          .filter((item) => item.state === "Активный")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const directivesDraft = response.directives
          .filter((item) => item.state === "Черновик")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const directivesCompleted = response.directives
          .filter((item) => item.state === "Отменён")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const instructionsActive = response.instructions
          .filter((item) => item.state === "Активный")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const instructionsDraft = response.instructions
          .filter((item) => item.state === "Черновик")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        const instructionsCompleted = response.instructions
          .filter((item) => item.state === "Отменён")
          .sort((a, b) => a.policyName.localeCompare(b.policyName));

        return {
          directives: response.directives || [],
          instructions: response.instructions || [],

          directivesActive: directivesActive || [],
          directivesDraft: directivesDraft || [],
          directivesCompleted: directivesCompleted || [],

          instructionsActive: instructionsActive || [],
          instructionsDraft: instructionsDraft || [],
          instructionsCompleted: instructionsCompleted || [],
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

    getPoliciesId: build.query({
      query: ({policyId}) => ({
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
    
    postPolicies: build.mutation({
      query: (body) => ({
        url: `policies/new`,
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Policy", id: "LIST" }],
    }),

    updatePolicies: build.mutation({
      query: (body) => ({
        url: `policies/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      // Обновляем теги, чтобы перезагрузить getPoliciesId
      invalidatesTags: (result, error, { policyId }) => [
        { type: "Policy", id: "LIST" },
        { type: "Policy", id: policyId },
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

