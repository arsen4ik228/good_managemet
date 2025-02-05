import apiSlice from "./api";

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    postConvert: build.mutation({
      query: ({ ...body }) => ({
        url: `converts/new`,
        method: "POST",
        body: {
          ...body,
        },
      }),
      invalidatesTags: [{ type: "Convert", id: "LIST" }],
    }),
  }),
});

export const { usePostConvertMutation } = convertApi;
