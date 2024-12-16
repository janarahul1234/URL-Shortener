import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation } from "react-query";

import apiClient from "@/apiClient";
import { useAuth } from "@/contexts/AuthContext";

import { RiCheckLine } from "react-icons/ri";
import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

const formSchema = object({
  name: string()
    .required("Display name field is required.")
    .min(3, "Display name must be at least 3 characters."),
  email: string()
    .required("Email field is required.")
    .email("Email address should be a valid email."),
});

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isUpdated, setIsUpdated] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const mutation = useMutation(
    (data) => apiClient.put(`/api/users/${user.id}`, data),
    {
      onSuccess: ({ data }) => {
        reset({
          name: data?.user?.name,
          email: data?.user?.email,
        });
        updateUser(data?.user);
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 2000);
      },
      onError: ({ response }) => {
        const errors = response?.data?.errors;

        Object.keys(errors).map((name) =>
          setError(name, { type: "apiError", message: errors[name][0] })
        );
      },
    }
  );

  const handleUpdateUser = (data) => mutation.mutate(data);

  const Success = () => (
    <>
      <RiCheckLine className="text-green-500 text-2xl" /> Saved!
    </>
  );

  return (
    <>
      <SectionHeader title="Profile" />

      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="max-w-[25rem] space-y-5 mb-10">
          <Input
            name="name"
            label="Display name"
            register={register("name")}
            message={errors?.name?.message}
          />
          <Input
            name="Email"
            type="email"
            label="Email"
            register={register("email")}
            message={errors?.email?.message}
          />
        </div>

        <Button variant="outline" disabled={mutation.isLoading}>
          {mutation.isLoading ? (
            <Loader />
          ) : isUpdated ? (
            <Success />
          ) : (
            "Update profile"
          )}
        </Button>
      </form>
    </>
  );
};

export default ProfilePage;
