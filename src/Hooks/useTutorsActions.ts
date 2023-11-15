import { useAppDispatch } from "./store";
import { Tutor } from "../Types/types.d";
import {
    setTutorsInfo,
    resetTutorsInfo,
    setSearchingTutorsInfo,
} from "../Store/Tutors/slice";

export const useTutorsActions = () => {
    const dispatch = useAppDispatch();

    const setTutors = (tutors: Tutor[]) => {
        console.log("Tutors: ", tutors);
        dispatch(setTutorsInfo(tutors));
    };

    const setSearchingTutors = (tutors: Tutor[]) => {
        dispatch(setSearchingTutorsInfo(tutors));
    };

    const resetTutors = () => {
        dispatch(resetTutorsInfo());
    };

    return { setTutors, resetTutors, setSearchingTutors };
};
