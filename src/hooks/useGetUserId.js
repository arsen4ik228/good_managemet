import { useSelector } from "react-redux";

export default function useGetUserId() {
    const reduxUserId = useSelector(
        (state) => state.localStorage.reduxUserId
    );

    return {
        reduxUserId,
    }
}
