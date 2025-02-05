import { selectedOrganizationId } from "./baseUrl";
import apiSlice from "./api";

export const organizationApi = apiSlice.injectEndpoints({
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
        return organizations
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
