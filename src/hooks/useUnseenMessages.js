
import { useLazyGetSeenMessagesQuery, useLazyGetUnSeenMessagesQuery, useSendMessageMutation, useLazyGetWatcherSeenMessagesQuery, useLazyGetWatcherUnSeenMessagesQuery } from '@services'; // Импортируем useLazyQuery
import { useEffect } from 'react';

export function useUnseenMessages(convertId) {


    const [fetchUnSeenMessages,
        { data: unseenMessages,
            isLoadingUnSeenMessages,
            isErrorUnSeenMessages,
            isFetchingUnSeenMessages
        }] = useLazyGetUnSeenMessagesQuery();

    // const [fetchWatcherUnSeenMessages,
    //     { data: watcherUnseenMessages,
    //         isLoadingWatcherUnSeenMessages,
    //         isErrorWatcherUnSeenMessages,
    //         isFetchingWatcherUnSeenMessages
    //     }] = useLazyGetWatcherUnSeenMessagesQuery();


    useEffect(() => {
        fetchUnSeenMessages({ convertId })
        
        // fetchWatcherUnSeenMessages({ convertId })
    }, [convertId])


    return {


        unSeenMessages: unseenMessages?.unSeenMessages || [],
        unSeenMessagesIds: unseenMessages?.unSeenMessagesIds || [],
        isLoadingUnSeenMessages,
        isErrorUnSeenMessages,
        isFetchingUnSeenMessages,


        // watcherUnseenMessages,
        // isLoadingWatcherUnSeenMessages,
        // isErrorWatcherUnSeenMessages,
        // isFetchingWatcherUnSeenMessages,

    };
}