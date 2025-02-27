import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        getMessagesId: build.query({
            query: ({ convertId }) => ({
                url: `messages/${convertId}`
            }),
            transformResponse: response => {

                const sortedMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;
                });

                return sortedMessages
            },
            //   transformResponse: response => {
            //     console.log('getConvertId', response);

            //     const messages = response?.messages
            //     const convertToPosts = response?.convertToPosts

            //     const transformMessages = (messages) => {
            //       // Сортируем сообщения по дате создания
            //       const sortedMessages = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            //       // Проходим по каждому сообщению и модифицируем его
            //       const transformedMessages = sortedMessages.map((item) => {
            //         // Проверяем условие
            //         if (item?.sender?.user?.id === userId) {
            //           // Удаляем свойство sender и добавляем userMessage: true
            //           const { sender, ...rest } = item; // Удаляем sender
            //           return { ...rest, userMessage: true }; // Добавляем userMessage: true
            //         } else {
            //           // Добавляем userMessage: false
            //           const { sender, ...rest } = item;
            //           return { ...rest, userMessage: false };
            //         }
            //       });

            //       return transformedMessages;
            //     };

            //   //   const selectSenderPostId = (convertToPosts, userId) => {
            //   //     console.warn(userId);

            //   //     const senderPost = convertToPosts.find(item => item.post.user.id === userId);
            //   //     return senderPost ? senderPost.post.id : null;
            //   // };
            //   const selectSenderPostId = (convertToPosts, userId) => {
            //     console.warn(userId);

            //     const senderPost = convertToPosts.find(item => item.post.user.id === userId);

            //     if (senderPost) {
            //         return {
            //             id: senderPost.post.id,
            //             postName: senderPost.post.postName,
            //         };
            //     } else {
            //         return {
            //             id: null,
            //             postName: null,
            //         };
            //     }
            // };
            //     // Модифицируем сообщения
            //     //const transformedMessages = transformMessages(messages);

            //     const { id: senderPostId, postName: senderPostName } = selectSenderPostId(convertToPosts, userId);
            //     // Возвращаем новый объект с модифицированными сообщениями
            //     return {
            //       currentConvert: response,
            //       messages: [],
            //       senderPostId: senderPostId,
            //       senderPostName: senderPostName,
            //     };
            //   },

            providesTags: result =>
                result
                    ? [{ type: "Convert", id: result.id }, "Convert"]
                    : ["Convert"],

        }),

        sendMessage: build.mutation({
            query: ({ convertId, ...body }) => ({
                url: `messages/${convertId}/sendMessage`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, err, arg) => [{ type: 'Convert', id: arg.convertId }],
        }),

    }),
});

export const { useGetMessagesIdQuery, useSendMessageMutation } = messageApi;
