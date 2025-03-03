import apiSlice from "./api";
import { userId } from "@helpers/constants";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({

        getMessagesId: build.query({
            query: ({ convertId, pagination }) => ({
                url: `messages/${convertId}/?pagination=${pagination}`

            }),
            transformResponse: response => {

                const sortedMessages = [...response]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedMessages?.forEach(item => {
                    item.userMessage = item.sender.user.id === userId;
                });

                return sortedMessages
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

export const { useGetMessagesIdQuery, useSendMessageMutation, useLazyGetMessagesIdQuery } = messageApi;
