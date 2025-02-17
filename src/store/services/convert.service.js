import apiSlice from "./api";

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({

    getConverts: build.query({
      query: () => ({
        url: 'converts'
      }),

      transformResponse: response => {
        console.log('getConverts', response)

        const result = []
        const convertIds = []

        response.forEach(item => {
          if (convertIds.some(id => id === item.userIds[0])) { // для груповых чатов вынести условие в отдельную функцию 
            const element = result.find(elem => elem.userIds === item.userIds[0])
            element.converts.push({
              convertId: item.convertId,
              convertTheme: item.c_convertTheme
            })
          }
          else {
            convertIds.push(item.userIds[0])
            result.push(
              {
                userIds: item.userIds[0],
                postName: item.postNames[0], // для груповых чатов предусмотреть своё имя "<Тип конверта> <количество собеседников>"
                employee: item.userFirstNames[0] + ' ' + item.userLastNames[0],
                converts: [
                  {
                    convertId: item.convertId,
                    convertTheme: item.c_convertTheme
                  }
                ]
              }
            )
          }
        })
        console.warn(result)
        return result //result.filter(item => item)
      },

      providesTags: result =>
        result?.currentGoal
          ? [{ type: "Convert", id: result.id }, "Convert"]
          : ["Convert"],
    }),

    postConvert: build.mutation({
      query: ({ ...body }) => ({
        url: `converts/new`,
        method: "POST",
        body: {
          ...body,
        },
      }),
      invalidatesTags: ["Convert"],
    }),
  }),
});

export const { useGetConvertsQuery, usePostConvertMutation } = convertApi;
