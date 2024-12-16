import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

import apiClient from "@/apiClient";
import Loader from "@/components/Loader";

const fetchLinksOverview = async () => {
  const { data } = await apiClient.get("/api/overview");
  return data?.overview;
};

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { isLoading, data: linksOverview } = useQuery(
    "links-overview",
    fetchLinksOverview
  );

  useEffect(() => {
    queryClient.invalidateQueries("links-overview");
  }, [queryClient]);

  if (isLoading) return <Loader size="lg" />;

  return (
    <div className="flex flex-wrap gap-4">
      <Card title="Total links" value={linksOverview?.total_links} />
      <Card title="Total clicks" value={linksOverview?.total_clicks} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="flex-1 min-w-[14rem] py-10 text-center border border-gray-200 rounded-xl shadow-sm">
    <p>{title}</p>
    <h2 className="text-gray-900 text-[3rem] font-semibold -mt-1">{value}</h2>
  </div>
);

export default DashboardPage;
