import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, selectedOrganizationId } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"

export const convertApi = createApi({
    reducerPath: "convert",
    tagTypes: ["Convert"],
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
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

export const {
    usePostConvertMutation
} = convertApi;