import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import apiClient from "@/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";

function GoogleCallback() {
  const { login } = useAuth();
  const { search } = useLocation();

  const fetchUser = async () =>
    await apiClient.get(`/api/auth/google/callback${search}`);

  useQuery("user", fetchUser, {
    onSuccess: ({ data }) => login(data.token, data.user),
  });

  return <Loader size="lg" className="h-screen" />;
}

export default GoogleCallback;
