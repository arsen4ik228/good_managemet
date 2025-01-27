import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, selectedOrganizationId } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"

export const organizationsApi = createApi({
  reducerPath: "Organizations",
  tagTypes: ["Organizations"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  endpoints: (build) => ({
    getOrganizations: build.query({
      query: () => ({
        url: `organizations`,
      }),

      transformResponse: (response) => {
        console.log('gerOrganizations:  ', response);
        const organizations = response?.map(
          ({ createdAt, updatedAt, ...rest }) => ({ ...rest })
        );
        return { 
          organizations: organizations, 
        };
    },
      providesTags: (result) => result ? [{ type: "Organizations", id: "LIST" }] : []
    }),

    updateOrganizations: build.mutation({
      query: ({...body }) => ({
        url: `organizations/${selectedOrganizationId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error) => result ? [{ type: "Organizations", id: "LIST" }] : []
    }),



  }),
});

export const {
  useGetOrganizationsQuery,
  useUpdateOrganizationsMutation
} = organizationsApi;
