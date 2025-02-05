
import apiSlice from "./api";

export const fileApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        postImage: build.mutation({
            query: (body) => ({
                url: `file-upload/upload`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Image"],
        }),
        postFiles: build.mutation({
            query: ({formData}) => ({
                url: `file-upload/uploadFile`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["File"],
        }),
    }),

});

export const { usePostImageMutation, usePostFilesMutation} = fileApi;
