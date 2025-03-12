import { Route, Routes } from "react-router";
import Layout from "./layout";
import SignIn from "./signIn";
import SignUp from "./signUp";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SignIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
