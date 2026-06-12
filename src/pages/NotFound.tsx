import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/site/SiteLayout";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <section className="min-h-[80vh] flex items-center">
        <div className="container-narrow text-center max-w-xl">
          <p className="eyebrow mb-4">{t("site.notFound.eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl">{t("site.notFound.title")}</h1>
          <p className="mt-6 text-muted-foreground">{t("site.notFound.body")}</p>
          <Button asChild size="lg" className="mt-10">
            <Link to="/">{t("site.notFound.returnHome")}</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
