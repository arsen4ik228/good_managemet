import apiSlice from "./api";
import { userId } from "@helpers/constants";

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

        const addConvertToDialogue = (dialogue, item) => {
          // Складываем unseenMessagesCount
          dialogue.unseenMessagesCount += parseInt(item.unseenMessagesCount) || 0;

          // Обновляем latestMessageCreatedAt, если новая дата больше
          if (item.latestMessageCreatedAt > dialogue.latestMessageCreatedAt) {
            dialogue.latestMessageCreatedAt = item.latestMessageCreatedAt;
          }

          // Добавляем конверт
          dialogue.converts.push({
            convertId: item.convertId,
            convertTheme: item.convertTheme,
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
              unseenMessagesCount: parseInt(item.unseenMessagesCount) || 0,
              latestMessageCreatedAt: item.latestMessageCreatedAt,
              converts: [{
                convertId: item.convertId,
                convertTheme: item.convertTheme,
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
              unseenMessagesCount: parseInt(item.unseenMessagesCount) || 0,
              latestMessageCreatedAt: item.latestMessageCreatedAt,
              converts: [{
                convertId: item.convertId,
                convertTheme: item.convertTheme,
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

      // providesTags: result =>
      //   result
      //     ? [{ type: "Convert", id: result.id }, "Convert"]
      //     : ["Convert"],

          providesTags: (result) =>
            result
              ? [
                ...result?.map(({ id }) =>
                ({
                  type: 'Convert',
                  id,
                }
                )),
                'Convert',
              ]
              : ['Convert'],
    }),

    getConvertId: build.query({
      query: ({ convertId }) => ({
        url: `converts/${convertId}`
      }),

      transformResponse: response => {
        console.log('getConvertId', response);

        const messages = response?.messages
        const convertToPosts = response?.convertToPosts

        const transformMessages = (messages) => {
          // Сортируем сообщения по дате создания
          const sortedMessages = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Проходим по каждому сообщению и модифицируем его
          const transformedMessages = sortedMessages.map((item) => {
            // Проверяем условие
            if (item?.sender?.user?.id === userId) {
              // Удаляем свойство sender и добавляем userMessage: true
              const { sender, ...rest } = item; // Удаляем sender
              return { ...rest, userMessage: true }; // Добавляем userMessage: true
            } else {
              // Добавляем userMessage: false
              const { sender, ...rest } = item;
              return { ...rest, userMessage: false };
            }
          });

          return transformedMessages;
        };

      //   const selectSenderPostId = (convertToPosts, userId) => {
      //     console.warn(userId);
      
      //     const senderPost = convertToPosts.find(item => item.post.user.id === userId);
      //     return senderPost ? senderPost.post.id : null;
      // };
      const selectSenderPostId = (convertToPosts, userId) => {
        console.warn(userId);
    
        const senderPost = convertToPosts.find(item => item.post.user.id === userId);
        
        if (senderPost) {
            return {
                id: senderPost.post.id,
                postName: senderPost.post.postName,
            };
        } else {
            return {
                id: null,
                postName: null,
            };
        }
    };
        // Модифицируем сообщения
        //const transformedMessages = transformMessages(messages);

        const { id: senderPostId, postName: senderPostName } = selectSenderPostId(convertToPosts, userId);
        // Возвращаем новый объект с модифицированными сообщениями
        return {
          currentConvert: response,
          messages: [],
          senderPostId: senderPostId,
          senderPostName: senderPostName,
        };
      },

      providesTags: result =>
        result
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

export const { useGetConvertsQuery, usePostConvertMutation, useGetConvertIdQuery } = convertApi;
