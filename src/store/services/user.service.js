import apiSlice from "./api";
import { userId } from '@helpers/constants'

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: ({ organizationId }) => ({
        url: `/users/${organizationId}/organization`
      }),
      transformResponse: (response) => {

        return response?.sort((a, b) => a.lastName.localeCompare(b.lastName));
      }
    }),

    getActiveUsers: build.query({
      query: ({ organizationId }) => ({
        url: `/users/${organizationId}/organization/active`
      }),
      transformResponse: (response) => {

        return response?.sort((a, b) => a.lastName.localeCompare(b.lastName));
      }
    }),

    getFiredUsers: build.query({
      query: ({ organizationId }) => ({
        url: `/users/${organizationId}/organization/fired`
      }),
      transformResponse: (response) => {

        return response?.sort((a, b) => a.lastName.localeCompare(b.lastName));
      }
    }),

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
        url: `/users/${body.id}/update`,
        method: "PATCH",
        body: {
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

export const { usePostUserMutation, useGetUserNewQuery, useGetUserIdQuery, useUpdateUserMutation, useGetUsersQuery, useGetActiveUsersQuery, useGetFiredUsersQuery } = userApi;
