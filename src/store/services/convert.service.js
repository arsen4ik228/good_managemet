import apiSlice from "./api";
import { userId } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers"

export const convertApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({

    getConverts: build.query({
      query: ({ contactId }) => ({
        url: `converts/${contactId}/converts`
      }),
      keepUnusedDataFor: 0, // данные удаляются сразу после unmount
      //cacheTime: 0,
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

        const {
          convert: {
            convertToPosts,
            watchersToConvert,
            host: hostPost,
            pathOfPosts = []
          } = {},
          allPostsInConvert = []
        } = response || {};

        const lastAddresseePostId = pathOfPosts[pathOfPosts.length - 1];

        const getLastAdresseUserInfo = () => {
          const lastAdressePost = allPostsInConvert.find(item => item.id === lastAddresseePostId);
          if (!lastAdressePost) return null;

          const { id, postName, user } = lastAdressePost;
          return {
            id,
            postName,
            userName: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar_url,
          };
        };

        const extractUserInfo = () => {
          if (!hostPost || !convertToPosts) return null;

          if (hostPost.user.id !== userId) {
            const { id, postName, user } = hostPost;
            return {
              id,
              postName,
              userName: `${user.firstName} ${user.lastName}`,
              avatar: user.avatar_url,
            };
          }

          return getLastAdresseUserInfo();
        };

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

        const selectWatcherPost = (watchers) => {
          const userWatcherPost = watchers?.find(item => item.post.user.id === userId).post

          const { user, ...rest } = userWatcherPost

          return rest
        }

        const selectRecipientPost = (convertToPosts, host) => {
          return (convertToPosts.find(item => item.post.id !== host.id)).post
        }

        const { id: senderPostId, postName: senderPostName, senderPostForSocket } = selectSenderPostId(convertToPosts, userId);
        const userInfo = extractUserInfo(hostPost, convertToPosts)

        const watcherPostForSocket = !senderPostId ? selectWatcherPost(watchersToConvert) : null
        const recipientPost = selectRecipientPost(convertToPosts, hostPost)

        return {
          currentConvert: response?.convert,
          userInfo,
          userIsHost: hostPost.user.id === userId,
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

    updateConvert: build.mutation({
      query: (body) => ({
        url: `converts/${body._id}/update`,
        method: "PATCH",
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
        body: {
          id: convertId
        }
      }),
      invalidatesTags: ["Convert"],
    }),

    finishConvert: build.mutation({
      query: (convertId) => ({
        url: `converts/${convertId}/finish`,
        method: "PATCH",
        body: {
          id: convertId
        }
      }),
      invalidatesTags: ["Convert"],
    }),


  }),
});

export const { useGetConvertsQuery, usePostConvertMutation, useGetConvertIdQuery, useApproveConvertMutation, useFinishConvertMutation, useUpdateConvertMutation } = convertApi;
