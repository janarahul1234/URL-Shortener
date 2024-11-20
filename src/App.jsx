import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import Input from "./components/Input";
import Button from "./components/Button";

const SERVER_URL = "https://lnk.free.nf";

const schema = object({
  original: string()
    .url("Must be a valid link.")
    .required("The original link field is required."),
  slug: string().required("The slug field is required."),
});

const App = () => {
  const [serverError, setServerError] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (form) => {
    setIsLoading(true);
    setServerError("");

    try {
      const { data } = await axios.post(`${SERVER_URL}/api/v1/urls`, {
        original: form.original,
        shorten: form.slug,
      });

      setShortLink(`${SERVER_URL}/${data.shorten}`);
      reset();
    } catch (error) {
      const shortenError = error.response?.data?.errors?.shorten;
      setServerError(
        shortenError
          ? "The slug has already been taken."
          : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      alert("Failed to copy the link. Please try manually.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl text-gray-950 mb-8">URL Shortener</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-80 grid mb-6">
        <div className="space-y-4 mb-5">
          <Input
            id="original"
            label="Original link"
            register={register}
            errorMessage={errors.original?.message}
          />

          <Input
            id="slug"
            label="Slug"
            register={register}
            errorMessage={errors.slug?.message || serverError}
          />
        </div>

        <Button
          label={isLoading ? "Shortening..." : "Shorten!"}
          disabled={isLoading}
        />
      </form>

      {shortLink && (
        <div className="flex items-center gap-2">
          <span>
            Your short link is:{" "}
            <a
              href={shortLink}
              target="_blank"
              className="text-blue-600 transition hover:underline"
            >
              {shortLink}
            </a>
          </span>

          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-100"
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
