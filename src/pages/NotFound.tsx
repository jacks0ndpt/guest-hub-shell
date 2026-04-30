import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/site/SiteLayout";

const NotFound = () => {
  return (
    <SiteLayout>
      <section className="min-h-[80vh] flex items-center">
        <div className="container-narrow text-center max-w-xl">
          <p className="eyebrow mb-4">404</p>
          <h1 className="text-5xl md:text-7xl">We couldn't find that page.</h1>
          <p className="mt-6 text-muted-foreground">
            The link might be old, or the page may have moved. Let's head back.
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link to="/">Return home</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
