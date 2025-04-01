import apiSlice from "./api";
import { userId } from "@helpers/constants";
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

        const transformConvertsForContact = (convertsForContact) => {

          const userHaveAgreement = convertsForContact?.some(item => item.convertPath === 'Согласование')

          if (!userHaveAgreement) return convertsForContact

          return convertsForContact?.map(item => {
            const userPostIsLastAddressee = item.activePostId === item.pathOfPosts[item.pathOfPosts.length - 1]

            if (userPostIsLastAddressee) return item

            return {
              ...item,
              convertType: 'Согласование'
            }
          })
        }

        return {
          contactInfo: transformContactInfo(response?.contact),
          allConverts: transformConvertsForContact(response?.convertsForContact).concat(transformCopiesConvert(response?.copiesForContact))
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
        const watchers = response?.watchersToConvert
        const host = response?.host

        const selectSenderPostId = (convertToPosts, userId) => {
          const senderPost = convertToPosts.find(item => item.post.user.id === userId);
          if (senderPost) {
            const { user, ...rest } = senderPost.post
            const senderPostForSocket = rest
            return {
              id: senderPost.post.id,
              postName: senderPost.post.postName,
              senderPostForSocket,
            };
          } else {
            return {
              id: null,
              postName: null,
            };
          }
        };

        const extractUserInfo = (hostPost) => {

          if (!hostPost) return

          return {
            id: hostPost.id,
            postName: hostPost.postName,
            userName: hostPost.user.firstName + ' ' + hostPost.user.lastName,
            avatar: hostPost.user.avatar_url,
          }

        }

        const selectWatcherPost = (watchers) => {
          const userWatcherPost = watchers.find(item => item.post.user.id === userId).post

          const { user, ...rest } = userWatcherPost

          return rest
        }

        const selectRecipientPost = (convertToPosts, host) => {
          return (convertToPosts.find(item => item.post.id !== host.id)).post
        }

        const { id: senderPostId, postName: senderPostName, senderPostForSocket } = selectSenderPostId(convertToPosts, userId);
        const userInfo = extractUserInfo(host)

        const watcherPostForSocket = !senderPostId ? selectWatcherPost(watchers) : null
        const recipientPost = !senderPostId ? selectRecipientPost(convertToPosts, host) : null

        return {
          currentConvert: response,
          userInfo,
          senderPostId: senderPostId,
          senderPostName: senderPostName,
          senderPostForSocket,
          watcherPostForSocket,
          recipientPost,
          organizationId: response?.host?.user?.organization?.id
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

    approveConvert: build.mutation({
      query: (convertId) => ({
        url: `converts/${convertId}/approve`,
        method: "PATCH",
        
      }),
      invalidatesTags: ["Convert"],
    }),



  }),
});

export const { useGetConvertsQuery, usePostConvertMutation, useGetConvertIdQuery, useApproveConvertMutation } = convertApi;
