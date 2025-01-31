import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url, selectedOrganizationId } from "./baseUrl"
import { prepareHeaders } from "./Function/prepareHeaders.js"

export const fileApi = createApi({
    reducerPath: "fileApi",
    tagTypes: ["Files"],
    baseQuery: fetchBaseQuery({ baseUrl: url, prepareHeaders }),
    endpoints: (build) => ({
        postImage: build.mutation({
            query: ({ formData }) => ({
                url: `file-upload/uploadFile`,
                method: "POST",
                body: formData,
            }),
        }),
    }),
})

export const {
    usePostImageMutation
} = fileApi;
