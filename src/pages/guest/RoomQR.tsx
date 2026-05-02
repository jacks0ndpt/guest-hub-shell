import { useParams, Link } from "react-router-dom";
import { useRoomBySlug } from "@/hooks/useGuestHub";
import GuestLayout from "@/components/guest/GuestLayout";
import GuestHub from "./GuestHub";
import { Button } from "@/components/ui/button";

const RoomQR = () => {
  const { qrCodeSlug } = useParams<{ qrCodeSlug: string }>();
  const { code, loading, notFound } = useRoomBySlug(qrCodeSlug);

  if (loading) {
    return (
      <GuestLayout>
        <p className="text-center text-muted-foreground py-20">Loading…</p>
      </GuestLayout>
    );
  }

  if (notFound || !code) {
    return (
      <GuestLayout>
        <div className="text-center py-16">
          <p className="eyebrow">QR not recognized</p>
          <h1 className="font-serif text-3xl mt-2">Room not found</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            This QR code isn't active. Please contact reception.
          </p>
          <Button asChild className="mt-6">
            <Link to="/guest">Open GuestHub</Link>
          </Button>
        </div>
      </GuestLayout>
    );
  }

  return <GuestHub initialRoom={code} />;
};

export default RoomQR;
