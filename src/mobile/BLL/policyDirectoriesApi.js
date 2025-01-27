import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"
import { selectedOrganizationId } from "./constans";
export const policyDirectoriesApi = createApi({
  reducerPath: "policyDirectories",
  tagTypes: ["PolicyDirectories"],
  baseQuery: fetchBaseQuery({ baseUrl,prepareHeaders}),
  endpoints: (build) => ({
    getPolicyDirectories: build.query({
      query: () => ({
        url: `policyDirectory/${selectedOrganizationId}`,
      }),

      transformResponse: (response) => {
        console.log('getPolicyDirectories     ', response)
        if (Array.isArray(response) && response.length > 0) {
          const Data = response.map(item => ({
            id: item.id,
            directoryName: item.directoryName,
            policies: item.policyToPolicyDirectories.flatMap(elem => elem.policy)
          }));
      
          return Data || []
        }
        //  else []
      },
           

      providesTags: [{ type: "policyDirectories", id: "LIST" }],
    }),

    postPolicyDirectories: build.mutation({
      query: ({...body }) => ({
        url: `policyDirectory/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "policyDirectories", id: "LIST"  }] : [],
    }),

    getPolicyDirectoriesId: build.query({
      query: ({ organizationId, policyDirectoryId }) => ({
        url: `policyDirectory/${organizationId}/${policyDirectoryId}/policyDirectory`,
      }),
      transformResponse: (response) => {
        console.log('getPolicyDirectoriesId     ',response)
          const Data = {
            id: response?.policyDirectory?.id,
            directoryName: response?.policyDirectory?.directoryName,
            policies: response?.policyDirectory?.policyToPolicyDirectories?.flatMap(elem => elem.policy)
      }
      
          return {
            activeDirectives: response?.directives || [],
            activeInstructions: response?.instructions || [],
            policyDirectory: Data || [],
            data: response || []
          }
        
    
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyDirectoryId }) =>
        result ? [{ type: "policyDirectories", id: policyDirectoryId }] : [],
    }),

    updatePolicyDirectories: build.mutation({
      query: ({policyDirectoryId , ...body}) => ({
        url: `policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => result ?  [{ type: "policyDirectories", id: "LIST" }]: []
    }), 

    deletePolicyDirectories: build.mutation({
      query: ({policyDirectoryId}) => ({
        url: `policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "policyDirectories", id: "LIST"  }],
    }), 
  }),
});

export const {
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useDeletePolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation,
  useGetPolicyDirectoriesIdQuery
} = policyDirectoriesApi;