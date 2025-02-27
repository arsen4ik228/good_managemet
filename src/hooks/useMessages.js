import {
    useGetMessagesIdQuery,
    useSendMessageMutation
} from "@services";
import { useMutationHandler } from "./useMutationHandler";

export function useMessages(convertId, pagination) {

    const {
        messages = [],
    } = useGetMessagesIdQuery({ convertId, pagination },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                messages: data || [],

            }),
        }
    );

    const [
        sendMessage,
    ] = useSendMessageMutation()


    return {
        messages,

        sendMessage
    };
}