import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query({
      query: ({ organizationId, structure = false }) => ({
        url: `posts/${organizationId}/?structure=${structure}`,
      }),
      transformResponse: (response) => {
        // Предполагаем, что response - это массив постов
        const originalPosts = Array.isArray(response) ? response : [];
        const filteredPosts = originalPosts.filter(
          (post) => post?.user?.id !== userId
        );

        return {
          originalPosts,
          filteredPosts,
        };
      },
      providesTags: (result) =>
        Array.isArray(result?.originalPosts) // Проверяем originalPosts вместо result
          ? [

              ...result.originalPosts.map(({ id }) => ({
                type: "Post",
                id,
              })),
              "Post",
            ]
          : ["Post"],
    }),

    postPosts: build.mutation({
      query: (body) => ({
        url: `posts/new`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id,
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
          roles: response?.roles || [],
          organizations: response?.organizations || [],
          maxDivisionNumber: response?.maxDivisionNumber || null,
        };
      },
      providesTags: ["Post", "User"],
    }),


   

    getPostsUserByOrganization: build.query({
      query: ({organizationId}) => ({
        url: `posts/myPostsInOrganization/${organizationId}`,
      }),
      providesTags: ["Post", "User"],
    }),

    getPostId: build.query({
      query: ({ postId }) => ({
        url: `posts/${postId}/post`,
      }),
      transformResponse: (response) => {
        console.log("getPostId    ", response); // Отладка ответа
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
          selectedPolicyNameInPost:
            response?.currentPost?.policy?.policyName || null,
        };
      },
      providesTags: (result, error, arg) => [{ type: "Post", id: arg.postId }],
    }),

    getAllChats: build.query({
      query: ({ organizationId }) => ({
        url: `posts/${organizationId}/contacts`,
      }),
      transformResponse: (response) => {
        console.log('getAllChats  ', response);
        const result = []

        response?.postsWithConverts.forEach(element => {
          const userExist = result.find(item => item.userId === element.userId)
          if (userExist) {
            userExist.postsNames = [...userExist.postsNames, element.postName]
            userExist.unseenMessagesCount = userExist.unseenMessagesCount + (element.unseenMessagesCount ?? 0)
            userExist.watcherUnseenCount = userExist.watcherUnseenCount + (element.watcherUnseenCount ?? 0)
          }
          else {
            result.push({
              ...element,
              unseenMessagesCount: element.unseenMessagesCount ?? 0,
              watcherUnseenCount: element.watcherUnseenCount ?? 0,
              postsNames: [element.postName]
            })
          }
        });

        response?.postsWithoutConverts.forEach(element => {
          const userExist = result.find(item => item.userId === element.user.id)
          if (userExist) {
            userExist.postsNames = [...userExist.postsNames, element.postName]
            userExist.unseenMessagesCount = userExist.unseenMessagesCount + (element.unseenMessagesCount ?? 0)
            userExist.watcherUnseenCount = userExist.watcherUnseenCount + (element.watcherUnseenCount ?? 0)
          }
          else {
            result.push({
              ...element,
              unseenMessagesCount: element.unseenMessagesCount ?? 0,
              watcherUnseenCount: element.watcherUnseenCount ?? 0,
              postsNames: [element.postName],
              userId: element?.user.id,
              userLastName: element?.user.lastName,
              userFirstName: element?.user.firstName
            })
          }
        });

        console.log(result)

        return result
        // response?.postsWithConverts.concat(
        //   response?.postsWithoutConverts
        // ); 
        //.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt))
      },
    }),

    getUnderPosts: build.query({
      query: ({ postId }) => ({
        url: `posts/${postId}/allUnderPosts`,
      }),
      providesTags: (result, error, arg) => [{ type: "Post", id: arg.postId }],
      transformResponse: (response) => {
        console.log("getUnderPosts    ", response); // Отладка ответа
        return {
          // currentPost: response?.currentPost || {},
          // parentPost: response?.parentPost || {},
          // policiesActive: response?.policiesActive || [],
          // posts: response?.posts || [],
          // workers: response?.workers || [],
          // organizations: response?.organizations || [],
          // statisticsIncludedPost: response?.currentPost?.statistics || [],
          underPosts: response,
        };
      },
    }),

    updatePosts: build.mutation({
      query: (body) => ({
        url: `/posts/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Post", id: arg._id },
        "User",
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetAllChatsQuery,
  useGetPostNewQuery,
  useGetPostsUserByOrganizationQuery,
  usePostPostsMutation,
  useGetPostIdQuery,
  useUpdatePostsMutation,
  useGetUnderPostsQuery,
} = postApi;
