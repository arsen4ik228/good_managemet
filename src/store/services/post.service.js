import apiSlice from "./api";


export const postApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
    getPosts: build.query({
      query: ({organizationId}) => ({
        url: `posts/${organizationId}`,
      }),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result?.map(({ id }) => ({
                type: 'Post',
                id,
              })),
              'Post',
            ]
          : ['Post'],
    }),

    postPosts: build.mutation({
      query: (body) => ({
        url: `posts/new`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id
      }),
      invalidatesTags: ["Post"],
    }),

    getPostNew: build.query({
      query: ({ organizationId }) => ({
        url: `posts/${organizationId}/new`,
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
      providesTags: ['Post', 'User'],
    }),

    getPostId: build.query({
      query: ({postId}) => ({
        url: `posts/${postId}/post`,
      }),
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg.postId }],
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

    getUnderPosts: build.query({
      query: ({postId }) => ({
        url: `posts/${postId}/allUnderPosts`,
      }),
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg.postId }],
      transformResponse: (response) => {
        console.log('getUnderPosts    ',response); // Отладка ответа
        return {
          // currentPost: response?.currentPost || {},
          // parentPost: response?.parentPost || {},
          // policiesActive: response?.policiesActive || [],
          // posts: response?.posts || [],
          // workers: response?.workers || [],
          // organizations: response?.organizations || [],
          // statisticsIncludedPost: response?.currentPost?.statistics || [],
          underPosts: response
        };
      },
    }),

    updatePosts: build.mutation({
      query: (body) => ({
        url: `/posts/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Post', id: arg._id }, 'User'],
    }),
  }),
});

export const { useGetPostsQuery, useGetPostNewQuery, usePostPostsMutation, useGetPostIdQuery, useUpdatePostsMutation, useGetUnderPostsQuery , useUpdateStatisticsToPostIdMutation} = postApi;
