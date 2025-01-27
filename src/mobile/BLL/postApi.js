import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, selectedOrganizationId } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"


export const postApi = createApi({
  reducerPath: "postApi",
  tagTypes: ["Post", "PostNew"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  endpoints: (build) => ({
    getPosts: build.query({
      query: () => ({
        url: `posts/${selectedOrganizationId}`,
      }),
      providesTags: (result, error) => [{ type: "Post", id: "LIST" }],
    }),

    postPosts: build.mutation({
      query: ({addPolicyId = "null", ...body }) => ({
        url: `posts/new?addPolicyId=${addPolicyId}`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }, { type: "PostNew", id: "NEW" }],
    }),

    getPostNew: build.query({
      query: () => ({
        url: `posts/${selectedOrganizationId}/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          policies: response?.policies || [],
          posts: response?.posts || [],
          organizations: response?.organizations || [],
          maxDivisionNumber: response?.maxDivisionNumber || null
        };
      },
      providesTags: (result, error, userId) => [{ type: "PostNew", id: "NEW" }],
    }),

    getPostId: build.query({
      query: ({postId }) => ({
        url: `posts/${postId}/post`,
      }),
      providesTags: (result, error, { postId }) => [{ type: 'Post', id: postId },{type: "Statistics", id: "LIST" }],
      transformResponse: (response) => {
        console.log('getPostId    ',response); // Отладка ответа
        return {
          currentPost: response?.currentPost || {},
          parentPost: response?.parentPost || {},
          policiesActive: response?.policiesActive || [],
          posts: response?.posts || [],
          workers: response?.workers || [],
          organizations: response?.organizations || [],
          statisticsIncludedPost: response?.currentPost?.statistics || [],
        };
      },
    }),

    updatePosts: build.mutation({
      query: (body) => ({
        url: `/posts/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: "LIST" },  // Инвалидация списка постов
        { type: "Post", id: postId },  // Инвалидация конкретного поста
      ],
    }),

    updateStatisticsToPostId: build.mutation({
      query: ({userId, postId , ...body}) => ({
        url: `${userId}/statistics/${postId}/updateBulk`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => result ? [{type: "Statistics", id: "LIST" }] : []
    }),
  }),
});

export const { useGetPostsQuery, useGetPostNewQuery, usePostPostsMutation, useGetPostIdQuery, useUpdatePostsMutation , useUpdateStatisticsToPostIdMutation} = postApi;
