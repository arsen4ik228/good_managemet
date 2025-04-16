import React from 'react'

export default function Test() {

    const createOrder = async () => {

    
        const Data = {}

        Data.convertTheme = convertTheme
        Data.convertType = "Приказ"
        Data.convertPath = 'Прямой'
        Data.deadline = deadlineDate
        Data.senderPostId = selectedPost // holdeerpostid у продукта
        Data.reciverPostId = reciverPostId // holdeerpostid у каждой задачи
        Data.messageContent = 'затычка в попу'// хуй знает
        Data.targetCreateDto = {
            type: "Приказ",
            orderNumber: 1,
            content: contentInput,
            holderPostId: reciverPostId,
            dateStart: startDate,
            deadline: deadlineDate,
        }

        await postConvert({
            ...Data
        })
            .unwrap()
            .then(() => {
              
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });

    }

  return (
    <div>Test</div>
  )
}
