
import { selectedOrganizationId } from "../../mobile/BLL/constans";
import apiSlice from "./api";
export const statisticsApi = apiSlice.injectEndpoints({

  endpoints: (build) => ({
    // getStatistics: build.query({
    //   query: ({ organizationId, statisticData = true }) => ({
    //     url: `/statistics/${organizationId}/?statisticData=${statisticData}`,
    //   }),
    //   transformResponse: (response) => {
    //     return response.sort((a, b) => a.name.localeCompare(b.name));
    //   },
    //   providesTags: (result) =>
    //     result ? [{ type: "Statistics", id: "LIST" }] : [],
    // }),

    // postStatistics: build.mutation({
    //   query: (body) => ({
    //     url: `statistics/new`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: (result) =>
    //     result ? [{ type: "Statistics", id: "LIST" }] : [],
    // }),

    getStatistics: build.query({
      query: ({ statisticData = true }) => ({
        url: `statistics/${selectedOrganizationId}/?statisticData=${statisticData}`,
      }),
      transformResponse: (response) => {
        console.log("getStatistics:  ", response);

        if (!Array.isArray(response)) {
          console.error("Response is not an array");
          return [];
        }

        const transformData = response?.map((item) => {
          return {
            id: item.id || "",
            name: item.name || "",
            ...(item.post && {
              post: {
                id: item?.post?.id || "",
                name: item.post?.postName || "",
              },
            }),
          };
        }).sort((a, b) => a.name.localeCompare(b.name));

        console.log("Transform Data:  ", transformData);
        return transformData;
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result?.map(({ id }) => ({
                type: 'Statistic',
                id,
              })),
              'Statistic',
            ]
          : ['Statistic'],
    }),

    postStatistics: build.mutation({
      query: ({ ...body }) => ({
        url: `/statistics/new`,
        method: "POST",
        type: "Прямая",
        name: "Статистика",
        statisticDataCreateDtos: [
          {
            value: 0,
            valueDate: new Date().toISOString().split("T")[0],
            isCorrelation: false,
          },
        ],
        body,
      }),
      invalidatesTags: ["Statistic"],
    }),

    getStatisticsId: build.query({
      query: ({ statisticId }) => ({
        url: `statistics/${statisticId}/statistic`,
      }),
      transformResponse: (response) => {
        return {
          currentStatistic: response || {},
          statisticDatas: response.statisticDatas || [],
        };
      },
      providesTags: (result, err, arg) => [{ type: 'Statistic', id: arg.statisticId }],
    }),

    updateStatistics: build.mutation({
      query: ({ statisticId, ...body }) => ({
        url: `/statistics/${statisticId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Statistic', id: arg.statisticId }],
    }),

    updateStatisticsToPostId: build.mutation({
      query: ({ postId, ...body }) => ({
        url: `statistics/${postId}/updateBulk`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: 'Post', id: arg.postId }],
    }),
  }),
});

export const {
  usePostStatisticsMutation,
  useGetStatisticsIdQuery,
  useGetStatisticsQuery,
  useUpdateStatisticsMutation,
} = statisticsApi;
