import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectedOrganizationId, url } from "./baseUrl";
import { prepareHeaders } from "./Function/prepareHeaders.js";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  tagTypes: ["Organization"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getOrganizations: build.query({
      query: () => ({
        url: `organizations`,
      }),
      providesTags: (result) =>
        result ? [{ type: "Organization", id: "LIST" }] : [],
      transformResponse: (response) => {
        const organizations = response?.map(
          ({ createdAt, updatedAt, ...rest }) => ({ ...rest })
        );
        return {
          organizations: organizations,
        };
      },
    }),

    getOrganizationId: build.query({
      query: ({organizationId}) => ({
        url: `organizations/${organizationId}`,
      }),
      providesTags: (result) =>
        result ? [{ type: "Organization", id: "LIST" }] : [],
    }),

    updateOrganizations: build.mutation({
      query: (body) => ({
        url: `organizations/${selectedOrganizationId}/update`,
        method: "PATCH",
        body:{
          _id:selectedOrganizationId,
          ...body
        },
      }),
      invalidatesTags: (result, error) =>
        result ? [{ type: "Organization", id: "LIST" }] : [],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationIdQuery,
  useUpdateOrganizationsMutation,
} = organizationApi;
