import EscrowDeposit from "@/components/escrow-deposit";
import { getFobShipmentById } from "@/data/fob-shipments";

export default async function EscrowPage({
  params,
}: {
  params: { id: string };
}) {
  const fobShipment = await getFobShipmentById(parseInt(params.id));
  
  if (!fobShipment) {
    return <div>Fob Shipment not found</div>;
  }

  return <EscrowDeposit shipment={fobShipment} />;
}
