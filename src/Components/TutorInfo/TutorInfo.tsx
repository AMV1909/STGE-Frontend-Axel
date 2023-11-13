import { TutorWithEvents } from "../../Types/types";
import unab_logo from "../../Assets/unab_logo_orange.png";

import "./TutorInfo.css";

enum TypeString {
    "Scheduled" = "Agendada",
    "Completed" = "Completada",
    "Requested" = "Solicitada",
    "Rejected" = "Rechazada",
    "Cancelled" = "Cancelada",
}

export function TutorInfo({
    selectedTutor,
}: {
    selectedTutor: TutorWithEvents | null;
}) {
    return (
        <div className="stge__home-functions">
            {selectedTutor ? (
                <div className="stge__home-functions_tutor">
                    <img src={selectedTutor.picture} alt={selectedTutor.name} />

                    <div>
                        <p>{selectedTutor.name}</p>

                        <p>
                            <strong>Carrera: </strong>
                            {selectedTutor.career}
                        </p>

                        <p>
                            <strong>Curso: </strong>
                            {selectedTutor.coursesToTeach.name} (
                            {selectedTutor.coursesToTeach.grade})
                        </p>
                    </div>

                    <table>
                        <thead>
                            <th>Estudiante</th>
                            <th>Curso</th>
                            <th>Fecha de inicio</th>
                            <th>Fecha de finalización</th>
                            <th>Estado</th>
                        </thead>

                        <tbody>
                            {selectedTutor.events.map((event) => {
                                let start = new Date(
                                    event.start
                                ).toLocaleDateString("es-CO", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                });

                                let end = new Date(
                                    event.end
                                ).toLocaleDateString("es-CO", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                });

                                start =
                                    start.charAt(0).toUpperCase() +
                                    start.slice(1);
                                end =
                                    end.charAt(0).toUpperCase() + end.slice(1);

                                return (
                                    <tr key={event._id}>
                                        <td>{event.student.name}</td>
                                        <td>{event.course}</td>
                                        <td>{start}</td>
                                        <td>{end}</td>
                                        <td>{TypeString[event.type]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="stge__home-functions_unselectedTutor">
                    <img src={unab_logo} alt="UNAB logo" />
                </div>
            )}
        </div>
    );
}
