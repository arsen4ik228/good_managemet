import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, formattedDate, notEmpty } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"

export const targetsApi = createApi({
    reducerPath: "targets",
    tagTypes: ["Targets"],
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    endpoints: (build) => ({
        getTargets: build.query({
            query: () => ({
                url: `targets`,
            }),
            transformResponse: (response) => {
                console.log('getTargets:    ', response)

                const transformArray = (array) => {
                    const currentDate = new Date().toISOString().split('T')[0];

                    const newArray = []
                    const futureTargets = []

                    array.forEach(item => {
                        const itemCopy = JSON.parse(JSON.stringify(item))
                        const dateWithoutTime = new Date(itemCopy.dateStart).toISOString().split('T')[0];

                        if (dateWithoutTime <= currentDate)
                            newArray.push(itemCopy)
                        else
                            futureTargets.push(itemCopy)
                    })

                    return [newArray, futureTargets]
                }
                const mergeAndTransformFutureTargets = (array1, array2, array3) => {
                    const mergeArraies = (array1 || []).concat(array2 || [], array3 || []);

                    return Array.from(
                        mergeArraies
                            .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
                            .reduce((resultMap, item) => {
                                const currentDate = formattedDate(item.dateStart).slice(0, 5);

                                if (resultMap.has(currentDate)) {
                                    resultMap.get(currentDate).items.push(item);
                                } else {
                                    resultMap.set(currentDate, {
                                        date: currentDate,
                                        items: [item],
                                    });
                                }

                                return resultMap;
                            }, new Map())
                            .values()
                    );
                };

                const [personalTargets, futurePersonalTargets] = transformArray(response?.personalTargets || []);
                console.log(personalTargets, futurePersonalTargets)
                const [orderTargets, futureOrderTargets] = transformArray(response?.ordersTargets || [])
                console.log(orderTargets, futureOrderTargets)
                const [projectTargets, futureProjectTargets] = transformArray(response?.projectTargets || [])
                const futureTargets = mergeAndTransformFutureTargets(futurePersonalTargets, futureOrderTargets, futureProjectTargets)

                // const transformTargetsArray = (array, marker) => {
                //     const currentDate = new Date().toISOString().split('T')[0];
                //     const groupedItems = {};
                //     console.warn(array, '         ', marker)

                //     array.forEach(item => {
                //         // Создаём копию объекта item, чтобы не мутировать исходные данные
                //         const itemCopy = JSON.parse(JSON.stringify(item)); // Глубокая копия
                //         console.log('item', itemCopy)
                //         const dateStart = itemCopy.dateStart;
                //         const dateWithoutTime = new Date(dateStart).toISOString().split('T')[0];
                //         const isFutureOrPastCurrent = dateWithoutTime > currentDate;

                //         if (!groupedItems[dateWithoutTime]) {
                //             groupedItems[dateWithoutTime] = [];
                //         }

                //         groupedItems[dateWithoutTime].push({
                //             ...itemCopy, // Используем копию объекта
                //             isFutureOrPastCurrent: isFutureOrPastCurrent
                //         });
                //     });
                //     console.log(groupedItems)
                //     const _groupedItems = JSON.parse(JSON.stringify(groupedItems))
                //     const groupedItems1 = JSON.parse(JSON.stringify(groupedItems))

                //     const currentTargets = Object.values(groupedItems)
                //         .filter(items => !items.some(item => item.isFutureOrPastCurrent))
                //         .flat()
                //         .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                //     console.log(currentTargets)
                //     const _futureTargets = Object.values(groupedItems1)
                //         .filter(items => items.some(item => item.isFutureOrPastCurrent))
                //         .map(elem => ({
                //             date: formattedDate(elem[0].dateStart).slice(0, 5),
                //             items: elem
                //         }))
                //     console.log(_futureTargets)

                //     const futureTargets = Object.values(_groupedItems)
                //         .filter(items => items.some(item => item.isFutureOrPastCurrent))
                //         .map(elem => ({
                //             date: formattedDate(elem[0].dateStart).slice(0, 5),
                //             items: elem
                //         }))
                //     console.log(futureTargets)

                //     return {
                //         currentTargets,
                //         futureTargets
                //     };
                // };

                // const merdgeOtherTargets = (array1, array2) => {


                //     if (!notEmpty(array1) && !notEmpty(array2))
                //         return []

                //     if (!notEmpty(array1))
                //         return array2

                //     if (!notEmpty(array2))
                //         return array1

                //     const [largerArray, smallerArray] = array1.length > array2.length ? [array1, array2] : [array2, array1];

                //     const result = smallerArray.map((smaller, smallerIndex) => {
                //         // Находим элемент в largerArray с такой же датой
                //         const sameDateElemIndex = largerArray.findIndex(larger => larger.date === smaller.date);

                //         if (sameDateElemIndex > -1) {
                //             // Если найден элемент с такой же датой, объединяем items
                //             smaller.items = smaller.items.concat(largerArray[sameDateElemIndex].items);
                //             // Удаляем элемент из largerArray, чтобы он не попал в финальный результат
                //             largerArray.splice(sameDateElemIndex, 1);
                //         }

                //         // Если это последний элемент smallerArray, добавляем оставшиеся элементы largerArray
                //         if (smallerIndex === smallerArray.length - 1) {
                //             smallerArray.push(...largerArray);
                //         }

                //         return smaller;
                //     });

                //     // Сортируем финальный результат по дате

                //     const sortedResult = result.sort((a, b) => new Date(b.date) - new Date(a.date));

                //     console.warn('sorted   ', sortedResult);
                //     return sortedResult;
                // }

                // const newPersonalTargets = transformTargetsArray(response?.personalTargets, 'personal')
                // const newOrdersTargets = transformTargetsArray(response?.ordersTargets, 'order')


                // console.log(' Orders   ', newOrdersTargets.futureTargets)
                // console.log('personal  ', newPersonalTargets.futureTargets)
                // const otherTargets = merdgeOtherTargets(newOrdersTargets.futureTargets, newPersonalTargets.futureTargets)

                const _userPosts = response?.userPosts.map(item => ({ ...item, organization: item.organization.id }))

                return {
                    userPosts: _userPosts,
                    personalTargets,
                    orderTargets,
                    futureTargets
                }
            },
            providesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),

        getArchiveTargets: build.query({
            query: () => ({
                url: 'targets/archive',
            }),
            transformResponse: (response) => {
                console.log('getArchiveTargets    ', response)
                return response
            },
            providesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],

        }),

        updateTargets: build.mutation({
            query: (body) => ({
                url: `targets/${body._id}/update`,
                method: "PATCH",
                body,
            }),
            // Обновляем теги, чтобы перезагрузить getStrategiesId
            invalidatesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),

        postTargets: build.mutation({
            query: (body) => ({
                url: `targets/new`,
                method: "POST",
                body,
            }),
            // transformResponse: (response) => ({
            //     id: response.id
            // }),
            invalidatesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),

        deleteTarget: build.mutation({
            query: ({ targetId }) => ({
                url: `targets/${targetId}/remove`,
                method: "DELETE",
                // body,
            }),
            // transformResponse: (response) => ({
            //     id: response.id
            // }),
            invalidatesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),
    })
})

export const {
    useGetTargetsQuery,
    useGetArchiveTargetsQuery,
    usePostTargetsMutation,
    useUpdateTargetsMutation,
    useDeleteTargetMutation,
} = targetsApi;