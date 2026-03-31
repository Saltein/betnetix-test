import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./routers";
import {
    AdminsPage,
    LoginPage,
    PostPage,
    PostsPage,
    ProfilePage,
    UsersPage,
} from "../pages";
import { MainLayout } from "./layouts";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/posts" element={<PostsPage />} />
                        <Route path="/admins" element={<AdminsPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/profile" element={<ProfilePage />} />

                        <Route path="/posts/:id" element={<PostPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
