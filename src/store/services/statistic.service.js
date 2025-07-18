import apiSlice from "./api";
export const statisticsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStatistics: build.query({
      query: ({ organizationId, statisticData = true }) => ({
        url: `statistics/${organizationId}/?statisticData=${statisticData}`,
      }),
      transformResponse: (response) => {
        console.log("getStatistics:  ", response);

        if (!Array.isArray(response)) {
          console.error("Response is not an array");
          return [];
        }

        const transformData = response
          ?.map((item) => {
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
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log("Transform Data:  ", transformData);
        return transformData;
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result?.map(({ id }) => ({
                type: "Statistic",
                id,
              })),
              "Statistic",
            ]
          : ["Statistic"],
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
      query: ({ statisticId, datePoint, viewType }) => ({
        url: `statistics/${statisticId}/statistic?datePoint=${datePoint}&viewType=${viewType}`,
      }),
      transformResponse: (response) => {
        return {
          currentStatistic: response.statistic || {},
          statisticData: response.statisticData || [],
        };
      },
      providesTags: (result, err, arg) => [
        { type: "Statistic", id: arg.statisticId },
      ],
    }),

    updateStatistics: build.mutation({
      query: ({ statisticId, ...body }) => ({
        url: `/statistics/${statisticId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [
        { type: "Statistic", id: arg.statisticId },
      ],
    }),

    updateStatisticsToPostId: build.mutation({
      query: ({ postId, ...body }) => ({
        url: `statistics/${postId}/updateBulk`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Post", id: arg.postId }],
    }),

    getStatisticsInControlPanel: build.query({
      query: ({ selectedControlPanelId, pagination = 0, datePoint }) => ({
        url: `statistics/${selectedControlPanelId}/statisticsInControlPanel?datePoint=${datePoint}`,
      }),

      providesTags:  [{ type: 'StatisticsInControlPanel', id: 'LIST' }],

      transformResponse: (response) => {
        const statisticsIdsInPanel = response.map((item) => item.id);

        const _response = response.map(({ panelToStatistics, ...rest }) => ({
          ...rest,
          panelToStatisticsId: panelToStatistics[0]?.id,
        }));
        return {
          allStatistics: _response || [],
          statisticsIdsInPanel: statisticsIdsInPanel,
        };
      },
    }),
  }),
});

export const {
  usePostStatisticsMutation,
  useGetStatisticsIdQuery,
  useGetStatisticsQuery,
  useUpdateStatisticsMutation,
  useUpdateStatisticsToPostIdMutation,
  useGetStatisticsInControlPanelQuery,
} = statisticsApi;
