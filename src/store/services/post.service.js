import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query({
      query: ({ organizationId, structure = false, isArchive = false }) => ({
        url: `posts/${organizationId}/?structure=${structure}&isArchive=${isArchive}`,
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
        //(response); // Отладка ответа
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
      query: ({ organizationId }) => ({
        url: `posts/myPostsInOrganization/${organizationId}`,
      }),
      providesTags: ["Post", "User"],
    }),

    getPostsUserByAccount: build.query({
      query: () => ({
        url: `posts/myPosts`,
      }),
      // transformResponse: (response) => {
      //   //('getPostsUserByAccount  ', response)
      //   return response
      // },
      providesTags: ["Post", "User"],
    }),

    getPostId: build.query({
      query: ({ postId }) => ({
        url: `posts/${postId}/post`,
      }),
      transformResponse: (response) => {
        //("getPostId    ", response); // Отладка ответа
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

    // getAllChats: build.query({
    //   query: ({ organizationId }) => ({
    //     url: `posts/${organizationId}/contacts`,
    //   }),
    //   transformResponse: (response) => {
    //     //('getAllChats  ', response);
    //     const result = []

    //     response?.postsWithConverts.forEach(element => {
    //       const userExist = result.find(item => item.userId === element.userId);
    //       if (userExist) {
    //         userExist.postsNames = [...userExist.postsNames, element.postName];
    //         userExist.unseenMessagesCount = (userExist.unseenMessagesCount || 0) + (Number(element.unseenMessagesCount) || 0);
    //         userExist.watcherUnseenCount = (userExist.watcherUnseenCount || 0) + (Number(element.watcherUnseenCount) || 0);
    //       } else {
    //         result.push({
    //           ...element,
    //           unseenMessagesCount: Number(element.unseenMessagesCount) || 0,
    //           watcherUnseenCount: Number(element.watcherUnseenCount) || 0,
    //           postsNames: [element.postName],
    //           user: {
    //             avatar_url: element.userAvatar
    //           }
    //         });
    //       }
    //     });

    //     response?.postsWithoutConverts.forEach(element => {
    //       const userExist = result.find(item => item.userId === element.user.id);
    //       if (userExist) {
    //         userExist.postsNames = [...userExist.postsNames, element.postName];
    //         userExist.unseenMessagesCount = (userExist.unseenMessagesCount || 0) + (Number(element.unseenMessagesCount) || 0);
    //         userExist.watcherUnseenCount = (userExist.watcherUnseenCount || 0) + (Number(element.watcherUnseenCount) || 0);
    //       } else {
    //         result.push({
    //           ...element,
    //           unseenMessagesCount: Number(element.unseenMessagesCount) || 0,
    //           watcherUnseenCount: Number(element.watcherUnseenCount) || 0,
    //           postsNames: [element.postName],
    //           userId: element?.user.id,
    //           userLastName: element?.user.lastName,
    //           userFirstName: element?.user.firstName
    //         });
    //       }
    //     });

    //     // result.sort((a, b) => {
    //     //   const countA = (Number(a.unseenMessagesCount) + Number(a.watcherUnseenCount)) || 0;
    //     //   const countB = (Number(b.unseenMessagesCount) + Number(b.watcherUnseenCount)) || 0;

    //     //   // Если у обоих сумма непрочитанных равна 0, сортируем по дате
    //     //   if (countA === 0 && countB === 0) {
    //     //     const dateA = new Date(a.latestMessageCreatedAt);
    //     //     const dateB = new Date(b.latestMessageCreatedAt);
    //     //     return dateB - dateA; // по убыванию (новые выше)
    //     //   }

    //     //   // Если у одного из элементов есть непрочитанные, а у другого нет
    //     //   if (countA === 0) return 1; // a без непрочитанных идет ниже b
    //     //   if (countB === 0) return -1; // b без непрочитанных идет ниже a

    //     //   // Оба имеют непрочитанные - сортируем по количеству
    //     //   return countB - countA; // по убыванию количества
    //     // });
    //     result.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt));
    //     //(result);

    //     return result
    //     // response?.postsWithConverts.concat(
    //     //   response?.postsWithoutConverts
    //     // ); 
    //     //.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt))
    //   },

    //   providesTags: (result) =>
    //     result
    //       ? [
    //         ...result?.map(({ userId }) =>
    //         ({
    //           type: 'Chats',
    //           id: userId,
    //         })),
    //         'Chats',
    //       ]
    //       : ['Chats']
    // }),

    getUnderPosts: build.query({
      query: ({ postId }) => ({
        url: `posts/${postId}/allUnderPosts`,
      }),
      providesTags: (result, error, arg) => [{ type: "Post", id: arg.postId }],
      transformResponse: (response) => {
        //("getUnderPosts    ", response); // Отладка ответа
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
  // useGetAllChatsQuery,
  useGetPostNewQuery,
  useGetPostsUserByOrganizationQuery,
  usePostPostsMutation,
  useGetPostIdQuery,
  useUpdatePostsMutation,
  useGetUnderPostsQuery,
  useGetPostsUserByAccountQuery
} = postApi;
