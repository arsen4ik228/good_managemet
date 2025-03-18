import apiSlice from "./api";
import { userId } from "@helpers/constants";
import _ from 'lodash'

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({

    getConverts: build.query({
      query: () => ({
        url: 'converts'
      }),

      transformResponse: response => {
        console.log('getConverts', response);

        const result = [];
        const postIdSet = new Set();
        const dialogueMap = new Map();

        const sortConvert = (array) => {
          return array.map(item => {
            const sortedConverts = [...item.converts].sort((a, b) => {
              return new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt);
            });

            return {
              ...item,
              converts: sortedConverts,
            };
          });
        };

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
            convertType: item.convertType,
            dateStart: item.createdAt,
            latestMessageCreatedAt: item.latestMessageCreatedAt,
            unseenMessagesCount: item.unseenMessagesCount,
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
                convertType: item.convertType,
                dateStart: item.createdAt,
                latestMessageCreatedAt: item.latestMessageCreatedAt,
                unseenMessagesCount: item.unseenMessagesCount,
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
                convertType: item.convertType,
                dateStart: item.createdAt,
                latestMessageCreatedAt: item.latestMessageCreatedAt,
                unseenMessagesCount: item.unseenMessagesCount,
              }],
            };
            dialogueMap.set(stringPostIds, newDialogue);
            result.push(newDialogue);
          }
        };

        const isPersonalOrGroup = (item) => {
          const isPersonalDialogue = item.postsAndUsers.length === 1;

          if (isPersonalDialogue)
            return { isPersonalDialogue, item };


          const isUserParticipantDialogue = item.postsAndUsers.some(
            post => post.user.userId === userId
          );

          if (isUserParticipantDialogue)
            return { isPersonalDialogue: false, item };


          const modifiedItem = { ...item };
          modifiedItem.postsAndUsers = [item.host];
          modifiedItem.postsAndUsers[0].user = item.host.hostUser;
          modifiedItem.convertType = 'Копия'

          return { isPersonalDialogue: true, item: modifiedItem };
        }

        // Обработка каждого элемента ответа
        response.forEach((convert) => {
          const { isPersonalDialogue, item } = isPersonalOrGroup(convert)

          if (isPersonalDialogue) {
            transformPersonalDialogue(item);
          } else {
            transformGroupDialogue(item);
          }
        });

        return sortConvert(result);
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

        const convertToPosts = response?.convertToPosts
        const watcherIds = response?.watherIds

        const selectSenderPostId = (convertToPosts, userId) => {
          const senderPost = convertToPosts.find(item => item.post.user.id === userId);
          if (senderPost) {
            const { user, ...rest } = senderPost.post
            const senderPostForSocket = rest
            return {
              id: senderPost.post.id,
              postName: senderPost.post.postName,
              senderPostForSocket
            };
          } else {
            return {
              id: null,
              postName: null,
            };
          }
        };

        const extractUserInfo = (watcherIds, convertToPosts, userId) => {
          // const userIsWatcher = watcherIds.includes(userId)

          // if (userIsWatcher) {
          //   return {
          //     postName: userPost.post.postName,
          //     userName: userPost.post.user.firstName + ' ' + userPost.post.user.lastName,
          //     avatar: userPost.post.user.avatar_url
          //   }
          // }


          const userPost = convertToPosts.find(item => item.post.user.id !== userId);
          console.log(userPost)
          if (userPost) {
            return {
              postName: userPost.post.postName,
              userName: userPost.post.user.firstName + ' ' + userPost.post.user.lastName,
              avatar: userPost.post.user.avatar_url
            }
          }

        }

        const { id: senderPostId, postName: senderPostName, senderPostForSocket } = selectSenderPostId(convertToPosts, userId);
        const userInfo = extractUserInfo(watcherIds, convertToPosts, userId)

        return {
          currentConvert: response,
          messages: [],
          userInfo,
          senderPostId: senderPostId,
          senderPostName: senderPostName,
          senderPostForSocket
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
