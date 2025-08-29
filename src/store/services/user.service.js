import apiSlice from "./api";
import { userId } from '@helpers/constants'

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    postUser: build.mutation({
      query: (body) => ({
        url: `/users/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getUserId: build.query({
      query: (_userId) => ({
        url: `users/${_userId}`
      })
    }),

    updateUser: build.mutation({
      query: (body) => ({
        url: `/users/${userId}/update`,
        method: "PATCH",
        body: {
          id: userId,
          ...body
        },
      }),
      invalidatesTags: ['User'],
    }),

    getUserNew: build.query({
      query: ({ organizationId }) => ({
        url: `users/${organizationId}/new`,
      }),
      providesTags: ['User'],
    }),

  }),
});

export const { usePostUserMutation, useGetUserNewQuery, useGetUserIdQuery, useUpdateUserMutation } = userApi;
