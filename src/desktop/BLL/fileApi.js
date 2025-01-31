import apiSlice from "./api";

export const fileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    postImage:  build.mutation({
        query: (body) => ({
          url: `file-upload/upload`,
          method: "POST",
          body,
        }),
      }),
  }),
});

export const { usePostImageMutation } = fileApi;
