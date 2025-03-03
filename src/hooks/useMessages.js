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

import { useLazyGetMessagesIdQuery, useSendMessageMutation } from '@services'; // Импортируем useLazyQuery
import { useEffect } from 'react';

export function useMessages(convertId, pagination) {
    const [fetchMessages, { data: messages, isLoading, isError, isFetching }] = useLazyGetMessagesIdQuery();

    useEffect(() => {
        // Выполняем запрос при изменении convertId или pagination
        fetchMessages({ convertId, pagination });
    }, [convertId, pagination]);


    const [
        sendMessage,
    ] = useSendMessageMutation()


    return {
        messages: messages || [],
        isLoading,
        isError,
        isFetching,

        sendMessage
    };
}