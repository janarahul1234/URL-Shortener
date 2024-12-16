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
  name: string()
    .required("Name is required.")
    .min(3, "Name must be at least 3 characters."),
  email: string()
    .email("Invalid email address.")
    .required("Email is required."),
  password: string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters"),
});

const SignupPage = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const mutation = useMutation(
    (data) => apiClient.post(`/api/auth/register`, data),
    {
      onSuccess: ({ data }) => login(data.token, data.user),
      onError: ({ response }) => {
        const errors = response?.data?.errors;

        Object.keys(errors).map((name) =>
          setError(name, { type: "apiError", message: errors[name] })
        );
      },
    }
  );

  const handleSignup = (credentials) => mutation.mutate(credentials);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Log in"
      linkHref="/login"
    >
      <form onSubmit={handleSubmit(handleSignup)}>
        <div className="space-y-5 mb-6">
          <Input
            name="name"
            label="Name"
            register={register("name")}
            message={errors?.name?.message}
          />
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
          {mutation.isLoading ? <Loader /> : "Register account"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
