import { deleteTempUserInfo, setTempUserInfo } from "../Store/TempUser/slice";
import { useAppDispatch } from "./store";
import { TempUser } from "../Types/types";

export const useTempUserActions = () => {
    const dispatch = useAppDispatch();

    const setTempUser = (tempUser: TempUser) => {
        if (!tempUser) return;

        dispatch(setTempUserInfo(tempUser));
    };

    const deleteData = () => {
        dispatch(deleteTempUserInfo());
    };

    return { setTempUser, deleteData };
};
