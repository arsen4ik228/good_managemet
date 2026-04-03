import {
    useGetPostsUserForViewQuery,
} from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";


export const useGetSinglePostForView = ({postId}) => {
    const {reduxSelectedOrganizationId} = useGetReduxOrganization();


    const {
        currentPost = {},
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetPostsUserForViewQuery(
        {postId},
        {
            selectFromResult: ({
                                   data,
                                   isLoading,
                                   isError,
                                   isFetching,
                               }) => ({
                currentPost: data?.currentPost || {},
                isLoadingGetPostId: isLoading,
                isErrorGetPostId: isError,
                isFetchingGetPostId: isFetching,
            }),
            skip: !postId
        }
    );


    return {
        reduxSelectedOrganizationId,

        currentPost,
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,

    };
};
