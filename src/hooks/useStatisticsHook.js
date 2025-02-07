import { useGetStatisticsIdQuery, useGetStatisticsQuery, usePostStatisticsMutation, useUpdateStatisticsMutation } from "../store/services/index"
import { useGetReduxOrganization } from '@hooks'



export const useStatisticsHook = ({ statisticData, statisticId }) => {

    const {reduxSelectedOrganizationId} = useGetReduxOrganization()

    const {
        statistics = [],
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
    } = useGetStatisticsQuery({organizationId: reduxSelectedOrganizationId ,statisticData: statisticData }, {
        selectFromResult: ({ data, isError, isFetching, isLoading }) => ({
            statistics: data || [],
            isLoadingGetStatistics: isLoading,
            isFetchingGetStatistics: isFetching,
            isErrorGetStatistics: isError
        })
    })

    const {
        currentStatistic = {},
        statisticDatas = [],
        isLoadingGetStatisticId,
        isErrorGetStatisticId,
        isFetchingGetStatisticId,
    } = useGetStatisticsIdQuery(
        { statisticId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentStatistic: data?.currentStatistic || {},
                statisticDatas: data?.statisticDatas || [],
                isLoadingGetStatisticId: isLoading,
                isErrorGetStatisticId: isError,
                isFetchingGetStatisticId: isFetching,
            }),
            skip: !statisticId,
        }
    );


    const [
        updateStatistics,
        {
            isLoading: isLoadingUpdateStatisticMutation,
            isSuccess: isSuccessUpdateStatisticMutation,
            isError: isErrorUpdateStatisticMutation,
            error: ErrorUpdateStatisticMutation,
        },
    ] = useUpdateStatisticsMutation();


    const [
        postStatistics,
        {
            isLoading: isLoadingPostStatisticMutation,
            isSuccess: isSuccessPostStatisticMutation,
            isError: isErrorPostStatisticMutation,
            error: ErrorPostStatisticMutation,
        },
    ] = usePostStatisticsMutation();

    return {
        statistics,
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,

        currentStatistic,
        statisticDatas,
        isLoadingGetStatisticId,
        isErrorGetStatisticId,
        isFetchingGetStatisticId,

        updateStatistics,
        isLoadingUpdateStatisticMutation,
        isSuccessUpdateStatisticMutation,
        isErrorUpdateStatisticMutation,
        ErrorUpdateStatisticMutation,

        postStatistics,
        isLoadingPostStatisticMutation,
        isSuccessPostStatisticMutation,
        isErrorPostStatisticMutation,
        ErrorPostStatisticMutation,

    }
}
