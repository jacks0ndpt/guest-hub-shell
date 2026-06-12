import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoomBySlug } from "@/hooks/useGuestHub";
import GuestLayout from "@/components/guest/GuestLayout";
import GuestHub from "./GuestHub";
import { Button } from "@/components/ui/button";

const RoomQR = () => {
  const { qrCodeSlug } = useParams<{ qrCodeSlug: string }>();
  const { code, loading, notFound } = useRoomBySlug(qrCodeSlug);
  const { t } = useTranslation();

  if (loading) {
    return (
      <GuestLayout>
        <p className="text-center text-muted-foreground py-20">{t("guest.qrLoading")}</p>
      </GuestLayout>
    );
  }

  if (notFound || !code) {
    return (
      <GuestLayout>
        <div className="text-center py-16">
          <p className="eyebrow">{t("guest.qrNotRecognized")}</p>
          <h1 className="font-serif text-3xl mt-2">{t("guest.qrNotFound")}</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {t("guest.qrInactive")}
          </p>
          <Button asChild className="mt-6">
            <Link to="/guest">{t("guest.openHub")}</Link>
          </Button>
        </div>
      </GuestLayout>
    );
  }

  return <GuestHub initialRoom={code} />;
};

export default RoomQR;
