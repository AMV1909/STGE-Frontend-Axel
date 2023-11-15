import { memo } from "react";
import { toast } from "react-hot-toast";

import { useAppSelector } from "../../Hooks/store";
import { socket } from "../../Socket";

function SocketListener() {
    const user = useAppSelector((state) => state.user);

    socket.on(`event-requested-${user._id}`, async () => {
        toast.success("Te han enviado una solicitud de tutoría.", {
            duration: 5000,
        });
    });

    socket.on(`event-rejected-${user._id}`, async (eventRejected) => {
        toast.success(
            `Tu solicitud de tutoría de ${eventRejected.course} ha sido rechazada.`,
            {
                duration: 5000,
            }
        );
    });

    socket.on(`event-accepted-${user._id}`, async (eventAccepted) => {
        toast.success(
            `Tu solicitud de tutoría de ${eventAccepted.course} ha sido aceptada.`,
            {
                duration: 5000,
            }
        );
    });

    socket.on(`event-cancelled-${user._id}`, async (eventCanceled) => {
        toast.success(
            `La tutoría de ${eventCanceled.course} ha sido cancelada.`,
            {
                duration: 5000,
            }
        );
    });

    socket.on(`event-completed-tutor-${user._id}`, async (eventCompleted) => {
        toast.success(
            `El tutor ${eventCompleted.tutor.name} ha marcado como completada la tutoría de ${eventCompleted.course}. Ve a tu perfil para calificarlo.`
        );
    });

    socket.on(`event-completed-student-${user._id}`, async (eventCompleted) => {
        toast.success(
            `El estudiante ${eventCompleted.student.name} ha marcado como completada la tutoría de ${eventCompleted.course} y te ha dado una calificación`
        );
    });

    socket.on(`all-events-rejected-${user._id}`, () => {
        toast.success(
            "Todas las solicitudes de tutorías han sido rechazadas.",
            {
                duration: 5000,
            }
        );
    });

    return null;
}

const MemoizedSocketListener = memo(SocketListener);

export default MemoizedSocketListener;
