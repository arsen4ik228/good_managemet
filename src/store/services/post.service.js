import apiSlice from "./api";


export const postApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
    getPosts: build.query({
      query: ({organizationId, structure = false}) => ({
        url: `posts/${organizationId}/?structure=${structure}`,
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

    getPostsUser: build.query({
      query: () => ({
        url: `posts/myPosts`,
      }),
      // transformResponse: (response) => {
      //   console.log(response); // Отладка ответа
      //   return {
          
      //   };
      // },
      providesTags: ['Post', 'User'],
    }),

    getPostId: build.query({
      query: ({postId}) => ({
        url: `posts/${postId}/post`,
      }),
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg.postId }],
      transformResponse: (response) => {
        console.log('getPostId    ',response); // Отладка ответа
        const sortWorkers = response?.workers?.sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) {
            return lastNameComparison; // Если фамилии разные, сортируем по ним
          }
          return a.firstName.localeCompare(b.firstName); // Если фамилии одинаковы, сортируем по имени
        });

        const sortPoliciesActive = response?.policiesActive?.sort((a, b) =>
          a.policyName.localeCompare(b.policyName)
        );
        const sortPosts = response?.posts?.sort((a, b) =>
          a.postName.localeCompare(b.postName)
        );
 
        return {
          currentPost: response?.currentPost || {},
          parentPost: response?.parentPost || {},
          policiesActive: sortPoliciesActive || [],
          posts: sortPosts || [],
          workers: sortWorkers || [],
          statisticsIncludedPost: response?.currentPost?.statistics || [],
          selectedPolicyIDInPost: response?.currentPost?.policy?.id || null,
          selectedPolicyNameInPost: response?.currentPost?.policy?.policyName || null,
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

export const { useGetPostsQuery, useGetPostNewQuery, useGetPostsUserQuery, usePostPostsMutation, useGetPostIdQuery, useUpdatePostsMutation, useGetUnderPostsQuery} = postApi;
