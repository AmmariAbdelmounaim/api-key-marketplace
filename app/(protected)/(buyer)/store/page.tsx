import StoreClient from "@/components/store-client";
import { getApiKeys } from "@/data/api-keys";

export default async function StorePage() {
  const apiKeys = await getApiKeys();

  return <StoreClient apiKeys={apiKeys} />;
}
