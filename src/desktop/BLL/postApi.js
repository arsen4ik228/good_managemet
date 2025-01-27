import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./baseUrl";
import { prepareHeaders } from "./Function/prepareHeaders.js";

export const postApi = createApi({
  reducerPath: "postApi",
  tagTypes: ["Post", "PostNew", "Statistics"],
  baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
  endpoints: (build) => ({
    getPosts: build.query({
      query: ({organizationId}) => ({
        url: `posts/${organizationId}`,
      }),
      transformResponse: (response) => {
        return response.sort((a, b) => a.postName.localeCompare(b.postName));
      },
      providesTags: (result, error, userId) => [{ type: "Post", id: "LIST" }],
    }),

    postPosts: build.mutation({
      query: ({ addPolicyId = "null", ...body }) => ({
        url: `posts/new?addPolicyId=${addPolicyId}`,
        method: "POST",
        body
      }),
      transformErrorResponse: (response) => {
        return {
          id: response?.id,
        };
      },
      invalidatesTags: [
        { type: "Post", id: "LIST" },
        { type: "PostNew", id: "NEW" },
      ],
    }),

    getPostNew: build.query({
      query: ({organizationId}) => ({
        url: `posts/${organizationId}/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        const sortWorkers = response?.workers?.sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) {
            return lastNameComparison; // Если фамилии разные, сортируем по ним
          }
          return a.firstName.localeCompare(b.firstName); // Если фамилии одинаковы, сортируем по имени
        });

        const sortPolicies = response?.policies?.sort((a, b) =>
          a.policyName.localeCompare(b.policyName)
        );
        const sortPosts = response?.posts?.sort((a, b) =>
          a.postName.localeCompare(b.postName)
        );

        return {
          workers: sortWorkers || [],
          policies: sortPolicies || [],
          posts: sortPosts || [],
          maxDivisionNumber: response?.maxDivisionNumber,
        };
      },
      providesTags: (result, error, userId) => [
        { type: "Post", id: "LIST" },
        { type: "PostNew", id: "NEW" },
      ],
    }),

    getPostId: build.query({
      query: ({ postId }) => ({
        url: `posts/${postId}/post`,
      }),
      providesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Statistics", id: "LIST" },
      ],
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
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
        const sortOrganizations = response?.organizations?.sort((a, b) =>
          a.organizationName.localeCompare(b.organizationName)
        );

        return {
          currentPost: response?.currentPost || {},
          parentPost: response?.parentPost || {},
          selectedPolicyIDInPost: response?.currentPost?.policy?.id || null,
          selectedPolicyNameInPost: response?.currentPost?.policy?.policyName || null,

          workers: sortWorkers || [],
          organizations: sortOrganizations || [],
          policies: sortPoliciesActive || [],
          posts: sortPosts || [],

          statisticsIncludedPost: response?.currentPost.statistics || [],
        };
      },
    }),

    updatePosts: build.mutation({
      query: ({ postId, ...body }) => ({
        url: `posts/${postId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: "LIST" }, // Инвалидация списка постов
        { type: "Post", id: postId }, // Инвалидация конкретного поста
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostNewQuery,
  usePostPostsMutation,
  useGetPostIdQuery,
  useUpdatePostsMutation,
} = postApi;
