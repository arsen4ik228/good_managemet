import apiSlice from "./api";
import { userId } from "@helpers/constants";
import _ from 'lodash'
import { notEmpty } from "@helpers/helpers"

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({

    getConverts: build.query({
      query: ({ contactId }) => ({
        url: `converts/${contactId}/converts`
      }),

      transformResponse: response => {
        console.log('getConverts', response);

        const transformContactInfo = (contact) => {
          return {
            postId: contact.id,
            postName: contact.postName,
            userName: contact?.user?.firstName + ' ' + contact?.user?.lastName,
            avatar: contact?.user?.avatar_url
          }
        }

        const transformCopiesConvert = (copiesArray) => {
          if (!notEmpty(copiesArray)) return []

          return copiesArray.map(item => {
            item.convertType = 'Копия'
            item.unreadMessagesCount = item.watchersToConvert[0].unreadMessagesCount
            item.lastSeenNumber = item.watchersToConvert[0].lastSeenNumber

            return item
          })
        }

        return {
          contactInfo: transformContactInfo(response?.contact),
          allConverts: response?.convertsForContact.concat(transformCopiesConvert(response?.copiesForContact))
        }
      },

      // providesTags: result =>
      //   result
      //     ? [{ type: "Convert", id: result.id }, "Convert"]
      //     : ["Convert"],

      providesTags: (result) =>
        result
          ? [
            ...result?.allConverts?.map(({ id }) =>
            ({
              type: 'Convert',
              id,
            }
            )),
            'Convert',
          ]
          : ['Convert'],
    }),

    getConvertId: build.query({
      query: ({ convertId }) => ({
        url: `converts/${convertId}`
      }),

      transformResponse: response => {
        console.log('getConvertId', response);

        const convertToPosts = response?.convertToPosts
        const watcherIds = response?.watherIds

        const selectSenderPostId = (convertToPosts, userId) => {
          const senderPost = convertToPosts.find(item => item.post.user.id === userId);
          if (senderPost) {
            const { user, ...rest } = senderPost.post
            const senderPostForSocket = rest
            return {
              id: senderPost.post.id,
              postName: senderPost.post.postName,
              senderPostForSocket
            };
          } else {
            return {
              id: null,
              postName: null,
            };
          }
        };

        const extractUserInfo = (watcherIds, convertToPosts, userId) => {
          // const userIsWatcher = watcherIds.includes(userId)

          // if (userIsWatcher) {
          //   return {
          //     postName: userPost.post.postName,
          //     userName: userPost.post.user.firstName + ' ' + userPost.post.user.lastName,
          //     avatar: userPost.post.user.avatar_url
          //   }
          // }


          const userPost = convertToPosts.find(item => item.post.user.id !== userId);
          console.log(userPost)
          if (userPost) {
            return {
              postName: userPost.post.postName,
              userName: userPost.post.user.firstName + ' ' + userPost.post.user.lastName,
              avatar: userPost.post.user.avatar_url
            }
          }

        }

        const { id: senderPostId, postName: senderPostName, senderPostForSocket } = selectSenderPostId(convertToPosts, userId);
        const userInfo = extractUserInfo(watcherIds, convertToPosts, userId)

        return {
          currentConvert: response,
          messages: [],
          userInfo,
          senderPostId: senderPostId,
          senderPostName: senderPostName,
          senderPostForSocket
        };
      },

      providesTags: result =>
        result
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

export const { useGetConvertsQuery, usePostConvertMutation, useGetConvertIdQuery } = convertApi;
