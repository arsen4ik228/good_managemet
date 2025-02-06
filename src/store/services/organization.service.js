import { selectedOrganizationId } from "../../mobile/BLL/constans";
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
        );
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
        { type: "ControlPanel", id: arg.organizationId },
      ],
    }),

    updateOrganizations: build.mutation({
      query: (body) => ({
        url: `organizations/${selectedOrganizationId}/update`,
        method: "PATCH",
        body: {
          _id: selectedOrganizationId,
          ...body,
        },
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Organization", id: arg.selectedOrganizationId },
      ],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationIdQuery,
  useUpdateOrganizationsMutation,
} = organizationApi;
