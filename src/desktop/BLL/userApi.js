import apiSlice from "./api";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    postUser: build.mutation({
      query: (body) => ({
        url: `/users/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { usePostUserMutation } = userApi;
