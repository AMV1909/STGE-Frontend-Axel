# Degree Project - Autonomous University of Bucaramanga

## Authors

-   [Axel Morales Vesga](https://github.com/AMV1909)
    -   [Linkedin](https://www.linkedin.com/in/axel-morales-vesga-200317239/)
-   [Santiago Hernando Bustos Morales](https://github.com/sbustos497)
    -   [Linkedin](https://www.linkedin.com/in/santiago-hernando-bustos-morales-24b06a229/)

## Description

This is the frontend of the project Student tutorial management and monitoring system (STMMS) or Sistema de gestión y monitoreo de tutorías estudiantiles (SGMTE) in spanish for the degree in Systems Engineering at the [Autonomous University of Bucaramanga](https://unab.edu.co).

This project proposes to use technologies for the development of a web platform that facilitates the access of university students to student tutorials. The platform seeks to complement the existing student tutoring program at the university, which has proven to be a solution for students who cannot access tutoring with their teachers due to scheduling problems, but not for university managers due to that the process of selecting and assigning tutors is a lengthy manual process, which can delay the process of assigning tutors to students. The web prototype will allow students to search for tutors by academic profile and teaching quality, establish available office hours, and connect with tutors with different academic profiles, based on their level of expertise in the area they wish to teach. On the part of the managers, the prototype will allow them to see in a more summarized and simple way the students who are registered on the platform, the amount of time they have given tutorials (duration of the meeting) and the subjects taught in their tutorials. . With the platform, it is expected to improve student access to specialized tutorials and foster a culture of collaboration and feedback among university students.

## Technologies

For this project we used the following technologies:

-   [Vite](https://vitejs.dev/): Next Generation Frontend Tooling.
-   [React](https://reactjs.org/): A JavaScript library for building user interfaces.

## Installation

For install this project you need to have installed [Node.js](https://nodejs.org/es/).

1. Clone the repository:

```bash
git clone
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of the project with the following content:

```
# Backend API
VITE_API_SOCKET_URL = ""
VITE_API_URL = ""

# Google API
VITE_GOOGLE_CLIENT_ID = ""
VITE_GOOGLE_CLIENT_SECRET = ""
```

4. Run the project:

```bash
npm run dev
```

## Commands

-   `npm run dev`: Run the server in development mode.
-   `npm run build`: Build the project for production.
