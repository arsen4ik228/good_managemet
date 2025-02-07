import { useGetPostIdQuery, useGetPostNewQuery, useGetPostsQuery, usePostPostsMutation, useUpdatePostsMutation, useGetUnderPostsQuery } from "../store/services/index";
import useGetReduxOrganization from "./useGetReduxOrganization";

export const usePostsHook = (postId) => {

     const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const {
        allPosts = [],
        isLoadingGetPosts,
        isErrorGetPosts,
    } = useGetPostsQuery({organizationId: reduxSelectedOrganizationId}, {
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
        underPosts = {},
        isLoadingGetUnderPosts,
        isErrorGetUnderPosts,
        isFetchingGetUnderPosts,
    } = useGetUnderPostsQuery(
        { postId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                underPosts: data?.underPosts || [],
                isLoadingGetUnderPosts: isLoading,
                isErrorGetUnderPosts: isError,
                isFetchingGetUnderPosts: isFetching,
            }),
            skip: !postId
        }
    );

    const [
        updatePost,
        {
            isLoading: isLoadingUpdatePostMutation,
            isSuccess: isSuccessUpdatePostMutation,
            isError: isErrorUpdatePostMutation,
            error: ErrorUpdatePostMutation
        },
    ] = useUpdatePostsMutation();


    const {
        staff = [],
        policies = [],
        parentPosts = [],
        maxDivisionNumber = undefined,
        isLoadingGetNew,
        isErrorGetNew,
    } = useGetPostNewQuery({organizationId: reduxSelectedOrganizationId}, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            staff: data?.workers || [],
            policies: data?.policies || [],
            parentPosts: data?.posts || [],
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


    return {

        reduxSelectedOrganizationId,

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

        underPosts,
        isLoadingGetUnderPosts,
        isErrorGetUnderPosts,
        isFetchingGetUnderPosts,


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
