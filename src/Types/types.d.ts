export type User = {
    _id: string;
    role: "Student" | "Tutor" | "Worker" | "Admin";
    name: string;
    email: string;
    // password: string;
    picture: string;
    career?: string;
    pga?: number;
    coursesToTeach?: Course[];
    score?: number;
    countReviews?: number;
    meetingTime?: number;
    tutorCalendarId?: string;
    active_disciplinary_processes?: boolean;
};

export type Tutor = {
    _id: string;
    role: "Tutor";
    name: string;
    email: string;
    // password: string;
    picture: string;
    career: string;
    pga: number;
    coursesToTeach: Course;
    score: number;
    countReviews: number;
    meetingTime: number;
    tutorCalendarId: string;
};

export type TutorWithEvents = Tutor & {
    events: Event[];
};

export type Course = {
    nrc: string;
    name: string;
    state: "Aprobado" | "Reprobado" | "Matriculado";
    grade: number;
};

export type TempUser = {
    id: string;
    name: string;
    email: string;
    picture: string;
    career: string;
    program_type: "Pregrado" | "Posgrado";
    active_disciplinary_processes: boolean;
    pga: number;
    courses: Course[];
};

export enum PathRoutes {
    Home = "/",
    Login = "/login",
    Register = "/register",
    SelectCoursesToTeach = "/select-courses-to-teach",
    TutorsList = "/tutors-list",
    Admin = "/admin",
    Profile = "/profile",
}

export type ProfileTabs =
    | ""
    | "schedule"
    | "scheduled"
    | "completed"
    | "modify"
    | "requested";

export type DateRange = {
    start: Date;
    end: Date;
};

export type SelectedDates = {
    title: string;
    description: string;
    attendees: [] | { email: string }[];
    course?: string;
} & DateRange;

export type Event = {
    _id: string;
    type: "Requested" | "Scheduled" | "Rejected" | "Completed";
    summary: string;
    description: string;
    course: string;
    student: {
        id: string;
        name: string;
        email: string;
        picture: string;
    };
    tutor: {
        id: string;
        name: string;
        email: string;
        picture: string;
    };
    start: string;
    end: string;
    link?: string;
    confirmedCompleted?: number;
};

export type Worker = {
    _id: string;
    role: "Worker";
    name: string;
    email: string;
    picture: string;
};

export type Notification = {
    _id: string;
    content: string;
    owner: string;
    read: boolean;
};
