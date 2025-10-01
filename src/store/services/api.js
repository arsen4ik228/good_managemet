import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "@helpers/authValidation/prepareHeaders";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: [
    "ControlPanel",
    "StatisticsInControlPanel",
    "Convert",
    "File",
    "Goal",
    "Objective",
    "Organization",
    "Directory",
    "Policy",
    "Post",
    "Project",
    "Program",
    "Statistic",
    "Strategy",
    "Target",
    "User",
    "Message",
    "Permissions",
  ],
  endpoints: (builder) => ({}),
});

export default apiSlice;
