import { Completed } from "./Completed/Completed";
import { Modify } from "./Modify/Modify";
import { Nothing } from "./Nothing/Nothing";
import { Schedule } from "./Schedule/Schedule";
import { Scheduled } from "./Scheduled/Scheduled";
import { Requested } from "./Requested/Requested";

import { ProfileTabs } from "../../Types/types";

export function ProfileTabsComponent({ tab }: { tab: ProfileTabs }) {
    switch (tab) {
        case "modify":
            return <Modify />;
        case "schedule":
            return <Schedule />;
        case "scheduled":
            return <Scheduled />;
        case "completed":
            return <Completed />;
        case "requested":
            return <Requested />;
        default:
            return <Nothing />;
    }
}
