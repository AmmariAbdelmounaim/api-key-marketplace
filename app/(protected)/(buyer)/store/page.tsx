import StoreClient from "@/components/store-client";
import { getFobShipments } from "@/data/fob-shipments";

export default async function StorePage() {
  const fobShipments = await getFobShipments();

  return <StoreClient shipments={fobShipments} />;
}
