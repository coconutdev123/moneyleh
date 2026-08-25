import SignUp from "./auth/SignUp";
import SignIn from "./auth/SignIn";
import ForgotPassword from "./auth/ForgotPw";

export function App() {
  return (
    <>
      <SignUp />
      <ForgotPassword />
      <SignIn />
    </>
  );
}

export default App
