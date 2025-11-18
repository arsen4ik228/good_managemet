import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useCreatePost, useGetDataForCreatePost } from "@hooks";
import { homeUrl } from "@helpers/constants";

export function useCreatePostAction() {
    const { createPost, reduxSelectedOrganizationId } = useCreatePost();
    const { maxDivisionNumber } = useGetDataForCreatePost();

    const createPostHandler = async () => {
        try {
            const result = await createPost({
                postName: " ",
                roleId: "55cdf95a-d7f3-4b2f-a37d-2c02e0b67f39",
                divisionName: `Подразделение №${maxDivisionNumber}`,
                // product: "  ",
                // purpose: "  ",
                organizationId: reduxSelectedOrganizationId
            }).unwrap();

            window.open(`${homeUrl}#/editPost/${result?.id}`, "_blank");
            message.success("Пост успешно создан");
        } catch (err) {
            message.error("Ошибка при создании поста");
        }
    };

    return createPostHandler;
}
