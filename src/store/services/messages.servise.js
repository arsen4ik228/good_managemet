import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        getSeenMessages: build.query({
            query: ({ convertId, pagination }) => ({
                url: `messages/${convertId}/seen/?pagination=${pagination}`

            }),
            transformResponse: response => {
                //const unSeenMessgesIds = []
                const sortedMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;

                    // if (item.timeSeen === null)
                    //     unSeenMessgesIds.push(item.id)
                });

                return sortedMessages

            },

            providesTags: result =>
                result
                    ? [{ type: "Convert", id: result.id }, "Convert"]
                    : ["Convert"],

        }),

        getUnSeenMessages: build.query({
            query: ({ convertId, pagination }) => ({
                url: `messages/${convertId}/unseen/?pagination=${pagination}`

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

export const { useSendMessageMutation, useLazyGetSeenMessagesQuery, useLazyGetUnSeenMessagesQuery } = messageApi;
