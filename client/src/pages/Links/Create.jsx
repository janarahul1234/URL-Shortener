import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation } from "react-query";

import apiClient from "@/apiClient";

import { RiCheckLine } from "react-icons/ri";
import Loader from "@/components/Loader";
import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";

const formSchema = object({
  title: string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  originalUrl: string()
    .url("Enter a valid URL")
    .required("Original URL is required"),
  shortUrl: string().notRequired(),
});

const CreatePage = () => {
  const navigate = useNavigate();
  const [isCreated, setIsCreate] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const mutation = useMutation((data) => apiClient.post(`/api/links`, data), {
    onSuccess: () => {
      setIsCreate(true);
      setTimeout(() => {
        setIsCreate(false);
        navigate(-1);
      }, 2000);
    },
    onError: ({ response, status }) => {
      if (status !== 422) return;

      setError("shortUrl", {
        type: "apiError",
        message: response.data.message,
      });
    },
  });

  const handleCreateLink = (data) => {
    mutation.mutate({
      title: data.title,
      original_url: data.originalUrl,
      custom_alias: data.shortUrl,
    });
  };

  const handleCancel = () => navigate(-1);

  const Success = () => (
    <>
      <RiCheckLine className="text-green-500 text-2xl" /> Saved!
    </>
  );

  return (
    <>
      <SectionHeader title="Create link" />

      <form onSubmit={handleSubmit(handleCreateLink)}>
        <div className="space-y-5 mb-6">
          <Input
            name="originalUrl"
            label="Original URL"
            register={register("originalUrl")}
            message={errors?.originalUrl?.message}
          />
          <Input
            name="title"
            label="Title"
            register={register("title")}
            message={errors?.title?.message}
          />
          <Input
            name="shortUrl"
            label="Short code"
            register={register("shortUrl")}
            message={errors?.shortUrl?.message}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="outline" disabled={mutation.isLoading}>
            {mutation.isLoading ? (
              <Loader />
            ) : isCreated ? (
              <Success />
            ) : (
              "Create Link"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreatePage;
