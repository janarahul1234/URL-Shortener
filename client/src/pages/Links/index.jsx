import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

import apiClient from "@/apiClient";

import Loader from "@/components/Loader";
import SectionHeader from "@/components/SectionHeader";
import LinkCard from "@/components/LinkCard";
import { Button } from "@/components/ui/button";

const fetchLinks = async () => {
  const { data } = await apiClient.get("/api/links");
  return data?.links;
};

const LinksPage = () => {
  const queryClient = useQueryClient();
  const { isLoading, data: links } = useQuery("links", fetchLinks);

  useEffect(() => {
    queryClient.invalidateQueries("links");
  }, [queryClient]);

  if (isLoading) return <Loader size="lg" />;

  return (
    <>
      <SectionHeader title="Links">
        <Button variant="outline" asChild>
          <Link to="/links/create">Create new link</Link>
        </Button>
      </SectionHeader>

      {links.length > 0 ? (
        <div className="space-y-6 mb-8">
          {links.map(
            ({
              id,
              title,
              original_url,
              short_url,
              click_count,
              created_at,
            }) => (
              <LinkCard
                key={id}
                id={id}
                title={title}
                originalUrl={original_url}
                shortUrl={short_url}
                clicks={click_count}
                timestamp={created_at}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-2xl text-center m-10">Links not yet.</div>
      )}
    </>
  );
};

export default LinksPage;
