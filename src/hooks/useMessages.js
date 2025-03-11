// import {
//     useGetMessagesIdQuery,
//     useSendMessageMutation
// } from "@services";
// import { useMutationHandler } from "./useMutationHandler";

// export function useMessages(convertId, pagination) {

//     const {
//         messages = [],
//         refetch: refetchMessagesId,
//     } = useGetMessagesIdQuery({ convertId, pagination },
//         {
//             selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
//                 messages: data || [],

//             }),
//         }
//     );

//     const [
//         sendMessage,
//     ] = useSendMessageMutation()


//     return {
//         messages,
//         refetchMessagesId,

//         sendMessage
//     };
// }

import { useLazyGetSeenMessagesQuery, useLazyGetUnSeenMessagesQuery, useSendMessageMutation } from '@services'; // Импортируем useLazyQuery
import { useEffect } from 'react';

export function useMessages(convertId, pagination) {
    const [fetchSeeenMessages, { data: seenMessagesResponse, isLoadingSeenMessages, isErrorSeenMessages, isFetchingSeenMessages }] = useLazyGetSeenMessagesQuery();
    const [fetchUnSeenMessages, { data, isLoadingUnSeenMessages, isErrorUnSeenMessages, isFetchingUnSeenMessages }] = useLazyGetUnSeenMessagesQuery();
    useEffect(() => {
        // Выполняем запрос при изменении convertId или pagination
        fetchSeeenMessages({ convertId, pagination });
        fetchUnSeenMessages({ convertId, pagination })
    }, [convertId, pagination]);

    //console.log(seenMessagesResponse)

    const [
        sendMessage,
    ] = useSendMessageMutation()


    return {
        seenMessages: seenMessagesResponse?.sortedMessages || [],
        unSeenMessageExist: seenMessagesResponse?.unSeenMessageExist || false,
        isLoadingSeenMessages,
        isErrorSeenMessages,
        isFetchingSeenMessages,

        unSeenMessages: data?.unSeenMessages || [],
        unSeenMessagesIds: data?.unSeenMessagesIds || [],
        isLoadingUnSeenMessages,
        isErrorUnSeenMessages,
        isFetchingUnSeenMessages,

        sendMessage,
    };
}