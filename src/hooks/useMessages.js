
import { useLazyGetSeenMessagesQuery, useLazyGetUnSeenMessagesQuery, useSendMessageMutation, useLazyGetWatcherSeenMessagesQuery, useLazyGetWatcherUnSeenMessagesQuery } from '@services'; // Импортируем useLazyQuery
import { useEffect } from 'react';

export function useMessages(convertId, pagination) {
    const [fetchSeeenMessages,
        { data: seenMessagesResponse,
            isLoadingSeenMessages,
            isErrorSeenMessages,
            isFetchingSeenMessages
        }] = useLazyGetSeenMessagesQuery();

    const [fetchWatcherSeeenMessages,
        { data: watcherSeenMessagesResponse,
            isLoadingWatcherSeenMessages,
            isErrorWatcherSeenMessages,
            isFetchingWatcherSeenMessages
        }] = useLazyGetWatcherSeenMessagesQuery();

    const [fetchUnSeenMessages,
        { data: unseenMessages,
            isLoadingUnSeenMessages,
            isErrorUnSeenMessages,
            isFetchingUnSeenMessages
        }] = useLazyGetUnSeenMessagesQuery();

    const [fetchWatcherUnSeenMessages,
        { data: watcherUnseenMessages,
            isLoadingWatcherUnSeenMessages,
            isErrorWatcherUnSeenMessages,
            isFetchingWatcherUnSeenMessages
        }] = useLazyGetWatcherUnSeenMessagesQuery();

    const [
        sendMessage,
    ] = useSendMessageMutation()

    // useEffect(() => {
    //     fetchSeeenMessages({ convertId, pagination });
    //     fetchWatcherSeeenMessages({ convertId, pagination })
    // }, [pagination]);

    useEffect(() => {
        fetchSeeenMessages({ convertId, pagination });
        // fetchUnSeenMessages({ convertId })
        
        fetchWatcherSeeenMessages({ convertId, pagination })
        // fetchWatcherUnSeenMessages({ convertId })
    }, [convertId, pagination])


    return {
        seenMessages: seenMessagesResponse?.sortedMessages || [],
        unSeenMessageExist: seenMessagesResponse?.unSeenMessageExist || false,
        isLoadingSeenMessages,
        isErrorSeenMessages,
        isFetchingSeenMessages,

        // unSeenMessages: unseenMessages?.unSeenMessages || [],
        // unSeenMessagesIds: unseenMessages?.unSeenMessagesIds || [],
        // isLoadingUnSeenMessages,
        // isErrorUnSeenMessages,
        // isFetchingUnSeenMessages,

        watcherSeenMessages: watcherSeenMessagesResponse?.sortedWatcherMessages || [],
        watcherUnseenMessageExist: watcherSeenMessagesResponse?.unseenWatcherMessageExist || false,
        isLoadingWatcherSeenMessages,
        isErrorWatcherSeenMessages,
        isFetchingWatcherSeenMessages,

        // watcherUnseenMessages,
        // isLoadingWatcherUnSeenMessages,
        // isErrorWatcherUnSeenMessages,
        // isFetchingWatcherUnSeenMessages,

        sendMessage,
    };
}