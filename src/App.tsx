import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoute } from "./Auth/ProtectedRoute";
import { PageLoader } from "./Components/PageLoader/PageLoader";
import { PathRoutes } from "./Types/types.d";
import { Navbar, SocketListener } from "./Components";
import {
    Home,
    Login,
    NotFound,
    Register,
    SelectCoursesToTeach,
    Profile,
    ListTutors,
    Admin,
} from "./Pages";

import "./App.css";

export function App() {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <>
            {loading ? (
                <PageLoader setLoading={setLoading} />
            ) : (
                <Router>
                    <Navbar />
                    <SocketListener />

                    <Routes>
                        <Route
                            path={PathRoutes.Home}
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={PathRoutes.Login}
                            element={
                                <ProtectedRoute>
                                    <Login />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={PathRoutes.Register}
                            element={
                                <ProtectedRoute>
                                    <Register />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={PathRoutes.SelectCoursesToTeach}
                            element={
                                <ProtectedRoute>
                                    <SelectCoursesToTeach />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={PathRoutes.Profile}
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={PathRoutes.TutorsList}
                            element={
                                <ProtectedRoute>
                                    <ListTutors />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={PathRoutes.Admin}
                            element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>

                    <Toaster />
                </Router>
            )}
        </>
    );
}
