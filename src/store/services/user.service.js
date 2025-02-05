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

    getUserNew: build.query({
      query: ({ organizationId }) => ({
        url: `users/${organizationId}/new`,
      }),
      providesTags: ["User"]
    }),

  }),
});

export const { usePostUserMutation, useGetUserNewQuery } = userApi;
