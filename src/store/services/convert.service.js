import apiSlice from "./api";

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({

    getConverts: build.query({
      query: () => ({
        url: 'converts'
      }),

      transformResponse: response => {
        console.log('getConverts', response)
        const arraiesPosts = []
        const result = response?.map(item => {
          const post = item.convertToPosts[0]?.post

          if (post && !arraiesPosts.includes(post.id)) {
            arraiesPosts.push(post.id)

            return post
          }
        })

        return result.filter(item => item)
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
