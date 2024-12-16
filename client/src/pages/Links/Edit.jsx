import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation, useQuery } from "react-query";

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
  shortUrl: string()
    .required("Short code is required")
    .min(3, "Short code must be at least 3 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Short code can only contain letters, numbers, underscores, and dashes."
    ),
});

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isUpdated, setIsUpdated] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const fetchLink = async () => {
    const { data } = await apiClient.get(`/api/links/${id}`);
    return data?.link;
  };

  const { isLoading, data: link } = useQuery(["link", id], fetchLink, {
    onSuccess: (data) =>
      reset({
        title: data.title,
        originalUrl: data.original_url,
        shortUrl: data.short_url,
      }),
  });

  const mutation = useMutation(
    (data) => apiClient.put(`/api/links/${id}`, data),
    {
      onSuccess: () => {
        setIsUpdated(true);
        setTimeout(() => {
          setIsUpdated(false);
          navigate(-1);
        }, 1000);
      },
      onError: ({ response, status }) => {
        if (status !== 422) return;

        setError("shortUrl", {
          type: "apiError",
          message: response.data.message,
        });
      },
    }
  );

  useEffect(() => {
    if (link) {
      reset({
        title: link.title,
        originalUrl: link.original_url,
        shortUrl: link.short_url,
      });
    }
  }, [link, reset]);

  const handleUpdateLink = (data) => {
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

  if (isLoading) return <Loader size="lg" />;

  return (
    <>
      <SectionHeader title="Edit link" />

      <form onSubmit={handleSubmit(handleUpdateLink)}>
        <div className="space-y-5 mb-6">
          <Input
            name="shortUrl"
            label="Short code"
            register={register("shortUrl")}
            message={errors?.shortUrl?.message}
          />
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
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="outline" disabled={mutation.isLoading}>
            {mutation.isLoading ? (
              <Loader />
            ) : isUpdated ? (
              <Success />
            ) : (
              "Update Link"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditPage;
