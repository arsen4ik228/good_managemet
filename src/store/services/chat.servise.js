// import apiSlice from "./api";
// import { userId } from "@helpers/constants";

// export const chatApi = apiSlice.injectEndpoints({
//   endpoints: (build) => ({
//     getAllChats: build.query({
//       query: ({ organizationId }) => ({
//         url: `posts/${organizationId}/contacts`,
//       }),
//       transformResponse: (response) => {
//         console.warn('getAllChats  ', response);
//         const result = []

//         response?.postsWithConverts.forEach(element => {
//           const userExist = result.find(item => item.userId === element.userId);
//           if (userExist) {
//             userExist.postsNames = [...userExist.postsNames, element.postName];
//             userExist.unseenMessagesCount = (userExist.unseenMessagesCount || 0) + (Number(element.unseenMessagesCount) || 0);
//             userExist.watcherUnseenCount = (userExist.watcherUnseenCount || 0) + (Number(element.watcherUnseenCount) || 0);
//           } else {
//             result.push({
//               ...element,
//               unseenMessagesCount: Number(element.unseenMessagesCount) || 0,
//               watcherUnseenCount: Number(element.watcherUnseenCount) || 0,
//               postsNames: [element.postName],
//               user: {
//                 avatar_url: element.userAvatar
//               }
//             });
//           }
//         });

//         response?.postsWithoutConverts.forEach(element => {
//           const userExist = result.find(item => item.userId === element.user.id);
//           if (userExist) {
//             userExist.postsNames = [...userExist.postsNames, element.postName];
//             userExist.unseenMessagesCount = (userExist.unseenMessagesCount || 0) + (Number(element.unseenMessagesCount) || 0);
//             userExist.watcherUnseenCount = (userExist.watcherUnseenCount || 0) + (Number(element.watcherUnseenCount) || 0);
//           } else {
//             result.push({
//               ...element,
//               unseenMessagesCount: Number(element.unseenMessagesCount) || 0,
//               watcherUnseenCount: Number(element.watcherUnseenCount) || 0,
//               postsNames: [element.postName],
//               userId: element?.user.id,
//               userLastName: element?.user.lastName,
//               userFirstName: element?.user.firstName
//             });
//           }
//         });

//         // result.sort((a, b) => {
//         //   const countA = (Number(a.unseenMessagesCount) + Number(a.watcherUnseenCount)) || 0;
//         //   const countB = (Number(b.unseenMessagesCount) + Number(b.watcherUnseenCount)) || 0;

//         //   // Если у обоих сумма непрочитанных равна 0, сортируем по дате
//         //   if (countA === 0 && countB === 0) {
//         //     const dateA = new Date(a.latestMessageCreatedAt);
//         //     const dateB = new Date(b.latestMessageCreatedAt);
//         //     return dateB - dateA; // по убыванию (новые выше)
//         //   }

//         //   // Если у одного из элементов есть непрочитанные, а у другого нет
//         //   if (countA === 0) return 1; // a без непрочитанных идет ниже b
//         //   if (countB === 0) return -1; // b без непрочитанных идет ниже a

//         //   // Оба имеют непрочитанные - сортируем по количеству
//         //   return countB - countA; // по убыванию количества
//         // });
//         result.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt));
//         //(result);

//         return result
//         // response?.postsWithConverts.concat(
//         //   response?.postsWithoutConverts
//         // ); 
//         //.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt))
//       },

//       providesTags: (result) =>
//         result
//           ? [
//             ...result?.map(({ userId }) =>
//             ({
//               type: 'Chats',
//               id: userId,
//             })),
//             'Chats',
//           ]
//           : ['Chats']
//     }),

//   }),
// });

// export const {
//   useGetAllChatsQuery,
// } = chatApi;


import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllChats: build.query({
      query: ({ organizationId }) => ({
        url: `posts/${organizationId}/contactsFromAllOrganizations`,
      }),
      transformResponse: (response) => {
        console.warn('getAllChats  ', response);
        const result = []

        response?.organizationContacts?.withConverts?.forEach(element => {
          const userExist = result.find(item => item.userId === element.userId);
          if (userExist) {
            userExist.postsNames = [...userExist.postsNames, element.postName];
            userExist.unseenMessagesCount = (userExist.unseenMessagesCount || 0) + (Number(element.unseenMessagesCount) || 0);
            userExist.watcherUnseenCount = (userExist.watcherUnseenCount || 0) + (Number(element.watcherUnseenCount) || 0);
          } else {
            result.push({
              ...element,
              unseenMessagesCount: Number(element.unseenMessagesCount) || 0,
              watcherUnseenCount: Number(element.watcherUnseenCount) || 0,
              postsNames: [element.postName],
              user: {
                avatar_url: element.userAvatar
              }
            });
          }
        });

        response?.organizationContacts?.withoutConverts?.forEach(element => {
          const userExist = result.find(item => item.userId === element.user.id);
          if (userExist) {
            userExist.postsNames = [...userExist.postsNames, element.postName];
            userExist.unseenMessagesCount = (userExist.unseenMessagesCount || 0) + (Number(element.unseenMessagesCount) || 0);
            userExist.watcherUnseenCount = (userExist.watcherUnseenCount || 0) + (Number(element.watcherUnseenCount) || 0);
          } else {
            result.push({
              ...element,
              unseenMessagesCount: Number(element.unseenMessagesCount) || 0,
              watcherUnseenCount: Number(element.watcherUnseenCount) || 0,
              postsNames: [element.postName],
              userId: element?.user.id,
              userLastName: element?.user.lastName,
              userFirstName: element?.user.firstName
            });
          }
        });

        // result.sort((a, b) => {
        //   const countA = (Number(a.unseenMessagesCount) + Number(a.watcherUnseenCount)) || 0;
        //   const countB = (Number(b.unseenMessagesCount) + Number(b.watcherUnseenCount)) || 0;

        //   // Если у обоих сумма непрочитанных равна 0, сортируем по дате
        //   if (countA === 0 && countB === 0) {
        //     const dateA = new Date(a.latestMessageCreatedAt);
        //     const dateB = new Date(b.latestMessageCreatedAt);
        //     return dateB - dateA; // по убыванию (новые выше)
        //   }

        //   // Если у одного из элементов есть непрочитанные, а у другого нет
        //   if (countA === 0) return 1; // a без непрочитанных идет ниже b
        //   if (countB === 0) return -1; // b без непрочитанных идет ниже a

        //   // Оба имеют непрочитанные - сортируем по количеству
        //   return countB - countA; // по убыванию количества
        // });
        result.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt));
        //(result);

        return {
          contacts: result,
          externalContacts: response?.externalContacts
        }
        // response?.postsWithConverts.concat(
        //   response?.postsWithoutConverts
        // ); 
        //.sort((a, b) => new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt))
      },

      providesTags: (result) =>
        result
          ? [
            ...result?.contacts?.map(({ userId }) =>
            ({
              type: 'Chats',
              id: userId,
            })),
            'Chats',
          ]
          : ['Chats']
    }),

  }),
});

export const {
  useGetAllChatsQuery,
} = chatApi;

