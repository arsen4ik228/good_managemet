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
          const userHasAgreement = convertsForContact?.some(item => item.convertPath === 'Согласование' || item.convertPath === 'Запрос')
          if (!userHasAgreement)
            return convertsForContact


          // const userPostIsLastAddressee = item.activePostId === item.pathOfPosts[item.pathOfPosts.length - 1]

          // if (userPostIsLastAddressee) return item

          // if(item.convertPath === 'Согласование') {
          //   return {
          //     ...item,
          //     convertType: 'Согласование'
          //   }
          // }

          return convertsForContact?.map(item => ({
            ...item,
            ...(item.convertPath === 'Согласование' && { convertType: 'Согласование' }),
            ...(item.convertPath === 'Запрос' && { convertType: 'Запрос' })
          }));
        };

        const splitReadAndUnreadMessages = (array1, array2) => {
          // /unseenMessagesCount
          const concatArray = array1.concat(array2)
          console.log(concatArray)
          const seen = []
          const unseen = []

          concatArray.forEach((item) => {
            if (+item.unseenMessagesCount > 0)
              unseen.push(item)
            else
              seen.push(item)
          })
          console.log(seen)
          return { seen, unseen }
        }

        const transformedConvertsForContact = transformConvertsForContact(response?.convertsForContact)
        const transformedCopiesConvert = transformCopiesConvert(response?.copiesForContact)
        const finalArray = splitReadAndUnreadMessages(transformedConvertsForContact, transformedCopiesConvert)
        console.log(finalArray.seen)
        return {
          contactInfo: transformContactInfo(response?.contact),
          seenConverts: finalArray.seen,
          unseenConverts: finalArray.unseen
        }
      },

      providesTags: (result) =>
        result
          ? [
            ...result?.seenConverts?.map(({ id }) =>
            ({
              type: 'Convert',
              id,
            }
            )),
            'Convert',
          ]
          : ['Convert'],
    }),

    getArchiveConverts: build.query({
      query: ({ contactId }) => ({
        url: `converts/${contactId}/converts/archive`
      }),
      keepUnusedDataFor: 0, // данные удаляются сразу после unmount
      //cacheTime: 0,
      transformResponse: response => {
        console.log('getArchiveConverts', response);

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
          const userHasAgreement = convertsForContact?.some(item => item.convertPath === 'Согласование' || item.convertPath === 'Запрос')
          if (!userHasAgreement)
            return convertsForContact


          // const userPostIsLastAddressee = item.activePostId === item.pathOfPosts[item.pathOfPosts.length - 1]

          // if (userPostIsLastAddressee) return item

          // if(item.convertPath === 'Согласование') {
          //   return {
          //     ...item,
          //     convertType: 'Согласование'
          //   }
          // }

          return convertsForContact?.map(item => ({
            ...item,
            ...(item.convertPath === 'Согласование' && { convertType: 'Согласование' }),
            ...(item.convertPath === 'Запрос' && { convertType: 'Запрос' })
          }));
        };

        return transformConvertsForContact(response?.archiveConvertsForContact).concat(transformCopiesConvert(response?.archiveCopiesForContact))
      },

      providesTags: (result) =>
        result
          ? [
            ...result?.map(({ id }) =>
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

        const getPathOfUsers = (postsArray) => {
          return postsArray.map(item => item.user.id);
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
          pathOfUsers: getPathOfUsers(allPostsInConvert),
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
      query: (body) => ({
        url: `converts/${body.convertId}/finish`,
        method: "PATCH",
        body: {
          pathOfUsers: body.pathOfUsers
        }
      }),
      invalidatesTags: ["Convert"],
    }),


  }),
});

export const {
  useGetConvertsQuery,
  useGetArchiveConvertsQuery,
  usePostConvertMutation,
  useGetConvertIdQuery,
  useApproveConvertMutation,
  useFinishConvertMutation,
  useUpdateConvertMutation } = convertApi;
