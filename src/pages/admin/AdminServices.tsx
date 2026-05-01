import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";

type ServiceItem = {
  id: string;
  title: string;
  description: string | null;
  price_estimate: number | null;
  is_paid_extra: boolean;
  requires_staff_confirmation: boolean;
  is_active: boolean;
  category_id: string | null;
};
type Category = { id: string; name: string };

const AdminServices = () => {
  usePageMeta("Services — Admin", "Manage your service categories and items.");
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [cats, setCats] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: itemData }, { data: catData }] = await Promise.all([
        supabase.from("service_items").select("*").order("sort_order"),
        supabase.from("service_categories").select("id, name"),
      ]);
      setItems((itemData as ServiceItem[]) ?? []);
      const map: Record<string, string> = {};
      (catData as Category[] | null)?.forEach((c) => (map[c.id] = c.name));
      setCats(map);
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header>
          <p className="eyebrow">Services</p>
          <h1 className="font-serif text-4xl mt-1">Service items</h1>
          <p className="text-muted-foreground mt-2">
            Items that guests can request via QR GuestHub. Editing UI coming soon.
          </p>
        </header>

        <div className="rounded-lg border border-border bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No service items yet.
                  </TableCell>
                </TableRow>
              )}
              {items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <p className="font-medium">{i.title}</p>
                    {i.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                        {i.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {i.category_id ? cats[i.category_id] : "—"}
                  </TableCell>
                  <TableCell>
                    {i.price_estimate && i.price_estimate > 0 ? `€${i.price_estimate}` : "—"}
                  </TableCell>
                  <TableCell>
                    {i.is_paid_extra ? (
                      <Badge>Paid extra</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                    {i.requires_staff_confirmation && (
                      <Badge variant="outline" className="ml-1">
                        Staff
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {i.is_active ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
