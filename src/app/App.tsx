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
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<PostsPage />} />
                            <Route path="/posts" element={<PostsPage />} />
                            <Route path="/admins" element={<AdminsPage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/profile" element={<ProfilePage />} />

                            <Route path="/post/:id" element={<PostPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
