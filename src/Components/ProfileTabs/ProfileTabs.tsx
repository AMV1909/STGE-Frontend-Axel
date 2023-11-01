import { Modify } from "./Modify/Modify";
import { Nothing } from "./Nothing/Nothing";
import { Schedule } from "./Schedule/Schedule";
import { EventsList } from "./EventsList/EventsList";

import { ProfileTabs } from "../../Types/types";

export function ProfileTabsComponent({ tab }: { tab: ProfileTabs }) {
    switch (tab) {
        case "modify":
            return <Modify />;
        case "schedule":
            return <Schedule />;
        case "scheduled":
            return <EventsList type="Scheduled" />;
        case "completed":
            return <EventsList type="Completed" />;
        case "requested":
            return <EventsList type="Requested" />;
        default:
            return <Nothing />;
    }
}
