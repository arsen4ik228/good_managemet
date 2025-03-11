import apiSlice from "./api";

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrganizations: build.query({
      query: () => ({
        url: `organizations`,
      }),

      transformResponse: (response) => {
        const organizations = response?.map(
          ({ createdAt, updatedAt, ...rest }) => ({ ...rest })
        ).sort((a, b) => a.organizationName.localeCompare(b.organizationName) );
        return organizations;
      },

      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({
                type: "Organization",
                id,
              })),
              "Organization",
            ]
          : ["Organization"],
      
    }),

    getOrganizationId: build.query({
      query: ({ organizationId }) => ({
        url: `organizations/${organizationId}`,
      }),
      providesTags: (result, err, arg) => [
        { type: "Organization", id: arg.organizationId },// ControlPanel
      ],
    }),

    updateOrganizations: build.mutation({
      query: (body) => ({
        url: `organizations/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Organization", id: arg._id },
      ],
    }),

    createOrganization: build.mutation({
      query: (body) => ({
        url: `organizations/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationIdQuery,
  useUpdateOrganizationsMutation,
  useCreateOrganizationMutation
} = organizationApi;
