import EscrowDeposit from "@/components/escrow-deposit";
import { getApiKeyById } from "@/data/api-keys";

export default async function EscrowPage({
  params,
}: {
  params: { id: string };
}) {
  const apiKey = await getApiKeyById(parseInt(params.id));
  
  if (!apiKey) {
    return <div>API Key not found</div>;
  }

  return <EscrowDeposit apiKey={apiKey} />;
}
