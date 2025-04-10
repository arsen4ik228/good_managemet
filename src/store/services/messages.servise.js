import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        getSeenMessages: build.query({
            query: ({ convertId, pagination }) => ({
                url: `messages/${convertId}/seen/?pagination=${pagination}`

            }),
            keepUnusedDataFor: 0,
            cacheTime: 0,
            transformResponse: response => {
                console.log('getSeenMessages', response)
                let unSeenMessageExist = false
                const sortedMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;

                    if (!unSeenMessageExist && item.timeSeen === null)
                        unSeenMessageExist = true
                });

                return { sortedMessages, unSeenMessageExist }

            },

            providesTags: result =>
                result
                    ? [{ type: "Convert", id: result.id }, "Convert"]
                    : ["Convert"],

        }),

        getUnSeenMessages: build.query({
            query: ({ convertId }) => ({
                url: `messages/${convertId}/unseen`

            }),
            transformResponse: response => {
                const unSeenMessagesIds = []
                const sortedMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;

                    if (item.timeSeen === null)
                        unSeenMessagesIds.push(item.id)
                });

                return {
                    unSeenMessages: sortedMessages,
                    unSeenMessagesIds: unSeenMessagesIds
                }
            },

            providesTags: result =>
                result
                    ? [{ type: "Convert", id: result.id }, "Convert"]
                    : ["Convert"],

        }),

        getWatcherSeenMessages: build.query({
            query: ({ convertId, pagination }) => ({
                url: `messages/${convertId}/watcher/seen/?pagination=${pagination}`

            }),
            keepUnusedDataFor: 0, // данные удаляются сразу после unmount
            cacheTime: 0,
            transformResponse: response => {
                console.log('getWatcherSeenMessages:  ', response)
                let unseenWatcherMessageExist = false
                const sortedWatcherMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedWatcherMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;

                    if (!unseenWatcherMessageExist && item.timeSeen === null)
                        unseenWatcherMessageExist = true
                    // if (item.timeSeen === null)
                    //     unSeenMessgesIds.push(item.id)
                });

                return { sortedWatcherMessages, unseenWatcherMessageExist }

            },

            providesTags: result =>
                result
                    ? [{ type: "Convert", id: result.id }, "Convert"]
                    : ["Convert"],

        }),

        getWatcherUnSeenMessages: build.query({
            query: ({ convertId }) => ({
                url: `messages/${convertId}/watcher/unseen`

            }),
            transformResponse: response => {
                console.log('getWatcherUnSeenMessages:  ', response)

                const unSeenMessagesIds = []
                const sortedMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;

                    if (item.timeSeen === null)
                        unSeenMessagesIds.push(item.id)
                });

                return [...sortedMessages]

            },

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

export const { useSendMessageMutation, useLazyGetSeenMessagesQuery, useLazyGetUnSeenMessagesQuery, useLazyGetWatcherSeenMessagesQuery, useLazyGetWatcherUnSeenMessagesQuery } = messageApi;
