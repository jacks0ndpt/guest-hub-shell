import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const sections = [
  { name: "Hero", description: "Headline, subtitle and main image on the homepage." },
  { name: "About", description: "Short story about the property." },
  { name: "Amenities", description: "Highlighted amenities shown on the homepage." },
  { name: "Gallery", description: "Photos used across rooms and the gallery page." },
  { name: "Location", description: "Nearby attractions, transport and map." },
  { name: "Contact", description: "Phone, email, WhatsApp and inquiry form copy." },
];

const AdminContent = () => {
  usePageMeta("Content — Admin", "Edit your website content sections.");
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header>
          <p className="eyebrow">Content</p>
          <h1 className="font-serif text-4xl mt-1">Website content</h1>
          <p className="text-muted-foreground mt-2">
            Editable sections for the public website. Inline editors coming soon.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Card key={s.name}>
              <CardContent className="p-5">
                <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <p className="font-serif text-xl mt-3">{s.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
