import apiSlice from "./api";

export const permissionsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPermissions: build.query({
      query: () => ({
        url: `me/permissions`,
      }),
    }),
  }),
});

export const { useGetPermissionsQuery } = permissionsApi;
