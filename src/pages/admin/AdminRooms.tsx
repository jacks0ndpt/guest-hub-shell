import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/hooks/useRooms";
import { usePageMeta } from "@/hooks/usePageMeta";

const AdminRooms = () => {
  usePageMeta("Rooms — Admin", "Manage your rooms and their details.");
  const { rooms, loading } = useRooms();

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header>
          <p className="eyebrow">Rooms</p>
          <h1 className="font-serif text-4xl mt-1">Rooms</h1>
          <p className="text-muted-foreground mt-2">
            Visual overview of your rooms. Full editing UI coming soon.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((r) => (
              <Card key={r.slug} className="overflow-hidden">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-xl">{r.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.slug}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {r.short_description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{r.capacity} guests</Badge>
                    <Badge variant="secondary">{r.bed_type}</Badge>
                    <Badge variant="outline">From €{r.price_from}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
