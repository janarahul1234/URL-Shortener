import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";

import apiClient, { BASE_URL } from "@/apiClient";

import {
  RiTimeLine,
  RiPencilLine,
  RiFileCopyLine,
  RiBarChart2Line,
  RiDeleteBin7Line,
  RiCheckLine,
} from "react-icons/ri";
import Loader from "./Loader";
import { Button } from "./ui/button";

const LinkCard = ({ id, title, originalUrl, shortUrl, clicks, timestamp }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);

  const deleteMutation = useMutation(
    () => apiClient.delete(`/api/links/${id}`),
    { onSuccess: () => queryClient.invalidateQueries("links") }
  );

  const handleCopyLink = () => {
    const linkToCopy = `${BASE_URL}/${shortUrl}`;

    navigator.clipboard.writeText(linkToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handelEditLink = () => navigate(`/links/${id}/edit`);

  return (
    <div className="relative pt-5 pb-4 px-6 border border-gray-200 rounded-xl shadow-sm">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="outline" onClick={handleCopyLink} className="px-4">
          {isCopied ? (
            <RiCheckLine className="text-green-600" />
          ) : (
            <>
              <RiFileCopyLine />
              <span className="text-sm font-medium">Copy</span>
            </>
          )}
        </Button>

        <Button variant="outline" size="icon" onClick={handelEditLink}>
          <RiPencilLine />
        </Button>

        <Button variant="outline" size="icon" onClick={deleteMutation.mutate}>
          {deleteMutation.isLoading ? (
            <Loader size="sm" />
          ) : (
            <RiDeleteBin7Line />
          )}
        </Button>
      </div>

      <h2 className="w-[calc(100%-12rem)] text-gray-900 text-2xl font-semibold truncate mb-5">
        {title}
      </h2>

      <div className="space-y-2 mb-6">
        <Link
          to={`${BASE_URL}/${shortUrl}`}
          target="_blank"
          className="block text-sm transition duration-300 hover:underline"
        >
          lnk.free.nf/{shortUrl}
        </Link>

        <Link
          target="_blank"
          to={originalUrl}
          className="block text-sm transition duration-300 hover:underline"
        >
          {originalUrl}
        </Link>
      </div>

      <div className="flex items-center justify-center gap-6">
        <CardInfo icon={RiBarChart2Line} value={`${clicks} Clicks`} />
        <CardInfo icon={RiTimeLine} value={formatTimestamp(timestamp)} />
      </div>
    </div>
  );
};

const CardInfo = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-1.5">
    <Icon />
    <span className="text-sm">{value}</span>
  </div>
);

const formatTimestamp = (timestamp) =>
  new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default LinkCard;
