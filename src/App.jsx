import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import CreateReferral from "./pages/createReferral/createReferral";
import CreateUser from "./pages/createUser/createUser";
import ManageUser from "./pages/manageUser/manageUser";
import CMS from "./pages/cms/CMS";
import SelectUser from "./pages/selectUser/selectUser";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { auth } from "./firebase";
import { login, logout } from "./redux/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import EditPage from "./pages/editPage/editPage";
import PreviewForm from "./pages/previewForm/previewForm";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(login(user.email));
      } else {
        dispatch(logout());
      }
    });
  }, []);

  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        {user ? (
          <Routes>
            <Route path="*" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/create-referral/:userId"
              element={<CreateReferral />}
            />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/manage-referred-users" element={<ManageUser />} />
            <Route path="/manage-created-users" element={<ManageUser />} />
            <Route path="/select-user" element={<SelectUser />} />{" "}
            <Route path="/cms" element={<CMS />} />{" "}
            <Route path="/edit-form" element={<EditPage />} />{" "}
            <Route path="/preview-form" element={<PreviewForm />} />{" "}
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;
