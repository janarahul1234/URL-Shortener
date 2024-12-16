import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import apiClient from "@/apiClient";
import Logo from "@/components/Logo";
import GoogleIcon from "@/assets/google-icon.svg";
import { Button } from "@/components/ui/button";

const fetchGoogleLoginUrl = async () => {
  const { data } = await apiClient.get("/api/auth/google");
  return data?.url;
};

const AuthLayout = ({ title, subtitle, linkText, linkHref, children }) => {
  const { isLoading, data: googleLoginUrl } = useQuery(
    "google-login-url",
    fetchGoogleLoginUrl
  );

  return (
    <section className="min-h-screen px-6 py-8 grid place-items-center">
      <div className="w-full">
        <div className="grid gap-3 mb-7">
          <Link to="/" className="justify-self-center">
            <Logo />
          </Link>

          <div className="text-center">
            <h1 className="text-gray-900 text-[2rem] font-semibold mb-2">
              {title}
            </h1>

            <p>
              {subtitle}{" "}
              <Link to={linkHref} className="text-gray-900 underline">
                {linkText}
              </Link>
            </p>
          </div>
        </div>

        <div className="max-w-[22.5rem] mx-auto">
          <Button variant="outline" className="w-full gap-4" asChild>
            <Link to={googleLoginUrl}>
              <img src={GoogleIcon} alt="google icon" />
              Continue with Google
            </Link>
          </Button>

          <div className="relative flex justify-center mt-7 mb-6">
            <div className="bg-white text-sm px-2">OR</div>
            <div className="w-full h-[1px] absolute top-1/2 bg-gray-300 -z-10"></div>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
