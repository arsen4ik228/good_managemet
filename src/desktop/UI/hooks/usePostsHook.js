
import { useGetPostIdQuery, useGetPostNewQuery, useGetPostsQuery, usePostPostsMutation, useUpdatePostsMutation } from "@BLL/postApi";
import useGetOrganizationId from "./useGetReduxOrganization";

export default function usePostsHook(postId) {

    const {reduxSelectedOrganizationId} = useGetOrganizationId();
    
    const {
        allPosts = [],
        isLoadingGetPosts,
        isErrorGetPosts,
    } = useGetPostsQuery({organizationId:reduxSelectedOrganizationId}, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            allPosts: data || [],
            isLoadingGetPosts: isLoading,
            isErrorGetPosts: isError,
        }),
    });


    const {
        currentPost = {},
        workers = [],
        posts = [],
        parentPost = {},
        policiesActive = [],
        statisticsIncludedPost = [],
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetPostIdQuery(
        { postId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentPost: data?.currentPost || {},
                workers: data?.workers || [],
                parentPost: data?.parentPost || {},
                posts: data?.posts || [],
                policiesActive: data?.policiesActive || [],
                statisticsIncludedPost: data?.statisticsIncludedPost || [],
                isLoadingGetPostId: isLoading,
                isErrorGetPostId: isError,
                isFetchingGetPostId: isFetching,
            }),
            skip: !postId
        }
    );


    const {
        staff = [],
        policies = [],
        parentPosts = [],
        maxDivisionNumber = undefined,
        isLoadingGetNew,
        isErrorGetNew,
    } = useGetPostNewQuery({organizationId:reduxSelectedOrganizationId}, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            workers: data?.workers || [],
            policies: data?.policies || [],
            posts: data?.posts || [],
            organizations: data?.organizations || [],
            maxDivisionNumber: data?.maxDivisionNumber + 1 || undefined,
            isLoadingGetNew: isLoading,
            isErrorGetNew: isError,
            data: data,
        }),
    });

    const [
        postPosts,
        {
            isLoading: isLoadingPostMutation,
            isSuccess: isSuccessPostMutation,
            isError: isErrorPostMutation,
            error: ErrorPostMutation
        },
    ] = usePostPostsMutation();

    const [
        updatePost,
        {
            isLoading: isLoadingUpdatePostMutation,
            isSuccess: isSuccessUpdatePostMutation,
            isError: isErrorUpdatePostMutation,
            error: ErrorUpdatePostMutation
        },
    ] = useUpdatePostsMutation();
    
    return {
        allPosts,
        isLoadingGetPosts,
        isErrorGetPosts,


        currentPost,
        workers,
        posts,
        parentPost,
        policiesActive,
        statisticsIncludedPost,
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,


        staff,
        policies,
        parentPosts,
        maxDivisionNumber,
        isLoadingGetNew,
        isErrorGetNew,


        postPosts,
        isLoadingPostMutation,
        isSuccessPostMutation,
        isErrorPostMutation,
        ErrorPostMutation,

        updatePost,
        isLoadingUpdatePostMutation,
        isSuccessUpdatePostMutation,
        isErrorUpdatePostMutation,
        ErrorUpdatePostMutation
    }
}
