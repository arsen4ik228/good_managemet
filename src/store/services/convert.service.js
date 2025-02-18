import { map } from "@mdxeditor/editor";
import apiSlice from "./api";

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({

    getConverts: build.query({
      query: () => ({
        url: 'converts'
      }),

      // transformResponse: response => {
      //   console.log('getConverts', response)

      //   const result = []
      //   const postIds = []

      //   const transformPersonalDialogue = (item) => {
      //     const postAndUser = item?.postsAndUsers[0]

      //     if (postIds.includes(postAndUser.postId)) {
      //       const exsistDialogue = result.find(elem => elem.postId === postAndUser.postId)
      //       exsistDialogue.converts.push({
      //         convertId: item.convertId,
      //         convertTheme: item.c_convertTheme
      //       })
      //     }
      //     else {
      //       postIds.push(postAndUser.postId)
      //       result.push({
      //         userIds: postAndUser.user.userId,
      //         avatar_url: postAndUser.user.avatar,
      //         postId: postAndUser.postId,
      //         postName: postAndUser.postName, // для груповых чатов предусмотреть своё имя "<Тип конверта> <количество собеседников>"
      //         employee: postAndUser.user.firstName + ' ' + item.postsAndUsers[0]?.user.lastName,
      //         converts: [{
      //           convertId: item.convertId,
      //           convertTheme: item.c_convertTheme
      //         }]
      //       })
      //     }
      //   }

      //   const transformGroupDoalodue = (item) => {
      //     const stringPostIds = item?.postsAndUsers?.reduce((acc, post) => {
      //       return acc + post.postId;
      //     }, '');

      //     if (postIds.includes(stringPostIds)) {
      //       const exsistDialogue = result.find(elem => elem.stringPostIds === stringPostIds)
      //       exsistDialogue.converts.push({
      //         convertId: item.convertId,
      //         convertTheme: item.c_convertTheme
      //       })
      //     }
      //     else {
      //       postIds.push(stringPostIds)
      //       result.push({
      //         // avatar_url: null,
      //         stringPostIds: stringPostIds,
      //         postName: `Cогласование`,
      //         employee: `Участников: ${item.postsAndUsers.length}`,
      //         converts: [{
      //           convertId: item.convertId,
      //           convertTheme: item.c_convertTheme
      //         }]
      //       })
      //     }
      //   }

      //   response.forEach(item => {
      //     const isPersonalDialogue = item?.postsAndUsers.length === 1

      //     if (isPersonalDialogue)
      //       transformPersonalDialogue(item)
      //     else
      //       transformGroupDoalodue(item)

      //   })

      //   return result
      // },
      
      transformResponse: response => {
        console.log('getConverts', response);

        const result = [];
        const postIdSet = new Set(); 
        const dialogueMap = new Map(); 

        // Общая функция для добавления конверта в диалог
        const addConvertToDialogue = (dialogue, item) => {
          dialogue.converts.push({
            convertId: item.convertId,
            convertTheme: item.c_convertTheme,
          });
        };

        // Функция для обработки личного диалога
        const transformPersonalDialogue = (item) => {
          const postAndUser = item.postsAndUsers[0];
          const { postId } = postAndUser;

          if (dialogueMap.has(postId)) {
            const existingDialogue = dialogueMap.get(postId);
            addConvertToDialogue(existingDialogue, item);
          } else {
            postIdSet.add(postId);
            const newDialogue = {
              userIds: postAndUser.user.userId,
              avatar_url: postAndUser.user.avatar,
              postId,
              postName: postAndUser.postName,
              employee: `${postAndUser.user.firstName} ${postAndUser.user.lastName}`,
              converts: [{
                convertId: item.convertId,
                convertTheme: item.c_convertTheme,
              }],
            };
            dialogueMap.set(postId, newDialogue);
            result.push(newDialogue);
          }
        };

        // Функция для обработки группового диалога
        const transformGroupDialogue = (item) => {
          const stringPostIds = item.postsAndUsers.reduce((acc, post) => acc + post.postId, '');

          if (dialogueMap.has(stringPostIds)) {
            const existingDialogue = dialogueMap.get(stringPostIds);
            addConvertToDialogue(existingDialogue, item);
          } else {
            postIdSet.add(stringPostIds);
            const newDialogue = {
              stringPostIds,
              postName: 'Согласование',
              employee: `Участников: ${item.postsAndUsers.length}`,
              converts: [{
                convertId: item.convertId,
                convertTheme: item.c_convertTheme,
              }],
            };
            dialogueMap.set(stringPostIds, newDialogue);
            result.push(newDialogue);
          }
        };

        // Обработка каждого элемента ответа
        response.forEach((item) => {
          const isPersonalDialogue = item.postsAndUsers.length === 1;

          if (isPersonalDialogue) {
            transformPersonalDialogue(item);
          } else {
            transformGroupDialogue(item);
          }
        });

        return result;
      },

      providesTags: result =>
        result?.currentGoal
          ? [{ type: "Convert", id: result.id }, "Convert"]
          : ["Convert"],
    }),

    postConvert: build.mutation({
      query: ({ ...body }) => ({
        url: `converts/new`,
        method: "POST",
        body: {
          ...body,
        },
      }),
      invalidatesTags: ["Convert"],
    }),
  }),
});

export const { useGetConvertsQuery, usePostConvertMutation } = convertApi;
