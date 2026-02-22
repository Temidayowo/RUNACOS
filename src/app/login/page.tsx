import { Metadata } from "next";
import LoginContent from "./LoginContent";

export const metadata: Metadata = {
  title: "Login | RUNACOS",
  description: "Sign in to the RUNACOS admin panel",
};

export default function LoginPage() {
  return <LoginContent />;
}
