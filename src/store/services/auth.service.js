import apiSlice from "./api";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    postLogout: build.mutation({
      query: (body) => ({
        url: `auth/logout`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { usePostLogoutMutation } = authApi;
