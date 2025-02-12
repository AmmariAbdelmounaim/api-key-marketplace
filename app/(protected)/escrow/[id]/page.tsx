import EscrowDeposit from "@/components/escrow-deposit";
import { getFobShipmentById } from "@/data/fob-shipments";

export default async function EscrowPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const fobShipment = await getFobShipmentById(parseInt(id));

  if (!fobShipment) {
    return <div>Fob Shipment not found</div>;
  }

  return <EscrowDeposit shipment={fobShipment} />;
}
