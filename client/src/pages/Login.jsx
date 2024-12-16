import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation } from "react-query";

import apiClient from "@/apiClient";
import { useAuth } from "@/contexts/AuthContext";

import Loader from "@/components/Loader";
import AuthLayout from "@/layouts/AuthLayout";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";

const formSchema = object({
  email: string()
    .email("Invalid email address.")
    .required("Email is required."),
  password: string().required("Password is required."),
});

const LoginPage = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const mutation = useMutation(
    (data) => apiClient.post(`/api/auth/login`, data),
    {
      onSuccess: ({ data }) => login(data.token, data.user),
      onError: (error) =>
        error.status === 401 &&
        setError("email", {
          type: "apiError",
          message: "Invalid email or password.",
        }),
    }
  );

  const handleLogin = (credentials) => mutation.mutate(credentials);

  return (
    <AuthLayout
      title="Log in and start shorten"
      subtitle="Don't have an account?"
      linkText="Sign Up"
      linkHref="/signup"
    >
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="space-y-5 mb-6">
          <Input
            name="email"
            label="Email"
            type="email"
            register={register("email")}
            message={errors?.email?.message}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            register={register("password")}
            message={errors?.password?.message}
          />
        </div>

        <Button className="w-full" disabled={mutation.isLoading}>
          {mutation.isLoading ? <Loader /> : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
