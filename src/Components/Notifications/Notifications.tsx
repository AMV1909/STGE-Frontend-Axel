import { Notification } from "../../Types/types.d";
import "./Notifications.css";

export function Notifications({
    notifications,
}: {
    notifications: Notification[];
}) {
    return (
        <div className="stge__notifications">
            <h1>Notificaciones</h1>

            <div className="stge__nofitications-container">
                {notifications.map((notification, index) => (
                    <div key={index} className="stge__notification">
                        <p>{notification.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
