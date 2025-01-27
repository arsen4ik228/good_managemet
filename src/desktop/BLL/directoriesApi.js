import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url, selectedOrganizationId} from "./baseUrl"
import {prepareHeaders} from "./Function/prepareHeaders.js"

export const directoriesApi = createApi({
  reducerPath: "directoriesApi",
  tagTypes: ["Directories"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({

    getDirectories: build.query({
      query: () => ({
        url: `policyDirectory/${selectedOrganizationId}`,
      }),
      transformResponse: (response) => {
        const foldersSort = response
        ?.map((element) => ({
          ...element,
          policyToPolicyDirectories: element.policyToPolicyDirectories
          ?.sort((a, b) =>
            a?.policy?.policyName.localeCompare(b?.policy?.policyName)
          )
          ?.sort((a, b) => {
              if (a?.policy?.type === "Директива" && b?.policy?.type !== "Директива") {
                return -1; 
              }
              if (a?.policy?.type !== "Директива" && b?.policy?.type === "Директива") {
                return 1;
              }
              return 0; 
            }), 
        }));
         

        return {
          folders: response || [],
          foldersSort: foldersSort,
        };
      },
      providesTags: [{ type: "Directories", id: "LIST" }],
    }),

    postDirectories: build.mutation({
      query: (body) => ({
        url: `policyDirectory/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Directories", id: "LIST" }] : [],
    }),

    updateDirectories: build.mutation({
      query: ({ policyDirectoryId, ...body }) => ({
        url: `/policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Directories", id: "LIST" }] : [],
    }),

    deleteDirectories: build.mutation({
      query: ({policyDirectoryId}) => ({
        url: `policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Directories", id: "LIST" }],
    }),

  }),
});

export const {
  useGetDirectoriesQuery,
  usePostDirectoriesMutation,
  useDeleteDirectoriesMutation,
  useUpdateDirectoriesMutation,
} = directoriesApi;
