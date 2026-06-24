import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { ICON_KEYS, resolveSectionIcon } from "@/lib/sectionIcons";
import type { ItemFieldSpec, SectionItem } from "@/hooks/useSiteContent";

type Props = {
  itemLabel: string;
  itemFields: ItemFieldSpec[];
  value: SectionItem[];
  onChange: (next: SectionItem[]) => void;
};

const blankItem = (fields: ItemFieldSpec[], nextOrder: number): SectionItem => {
  const base: SectionItem = { is_active: true, sort_order: nextOrder };
  for (const f of fields) {
    if (f.type === "icon") base.icon_key = "sparkles";
    else if (f.bilingual) {
      base[`${f.key}_ro`] = "";
      base[`${f.key}_en`] = "";
    } else {
      base[f.key] = "";
    }
  }
  return base;
};

const SectionItemsEditor = ({ itemLabel, itemFields, value, onChange }: Props) => {
  const { t } = useTranslation();
  const items = Array.isArray(value) ? value : [];

  const update = (idx: number, patch: Partial<SectionItem>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  };

  const remove = (idx: number) => {
    const next = items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sort_order: i }));
    onChange(next);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next.map((it, i) => ({ ...it, sort_order: i })));
  };

  const add = () => onChange([...items, blankItem(itemFields, items.length)]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t("admin.contentPage.items.empty", { defaultValue: "No items yet." })}
        </p>
      )}

      {items.map((item, idx) => {
        const Icon = resolveSectionIcon(item.icon_key);
        return (
          <div key={idx} className="rounded-md border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {itemLabel} {idx + 1}
                </span>
                <Badge variant={item.is_active === false ? "secondary" : "default"}>
                  {item.is_active === false
                    ? t("common.inactive")
                    : t("common.active")}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 mr-2">
                  <Label className="text-xs text-muted-foreground">
                    {t("common.active")}
                  </Label>
                  <Switch
                    checked={item.is_active !== false}
                    onCheckedChange={(v) => update(idx, { is_active: v })}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  aria-label={t("admin.contentPage.items.moveUp", { defaultValue: "Move up" })}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                  aria-label={t("admin.contentPage.items.moveDown", { defaultValue: "Move down" })}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(idx)}
                  aria-label={t("common.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {itemFields.map((f) => {
                if (f.type === "icon") {
                  return (
                    <div key={f.key} className="space-y-1.5 md:col-span-2">
                      <Label>{f.label}</Label>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={(item.icon_key as string) ?? ""}
                        onChange={(e) => update(idx, { icon_key: e.target.value })}
                      >
                        {ICON_KEYS.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (f.bilingual) {
                  return (["ro", "en"] as const).map((lng) => {
                    const k = `${f.key}_${lng}`;
                    return (
                      <div key={k} className="space-y-1.5">
                        <Label>
                          {f.label} ({lng.toUpperCase()})
                        </Label>
                        {f.type === "textarea" ? (
                          <Textarea
                            rows={2}
                            value={(item[k] as string) ?? ""}
                            onChange={(e) => update(idx, { [k]: e.target.value })}
                          />
                        ) : (
                          <Input
                            value={(item[k] as string) ?? ""}
                            onChange={(e) => update(idx, { [k]: e.target.value })}
                          />
                        )}
                      </div>
                    );
                  });
                }

                return (
                  <div key={f.key} className="space-y-1.5 md:col-span-2">
                    <Label>{f.label}</Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        rows={2}
                        value={(item[f.key] as string) ?? ""}
                        onChange={(e) => update(idx, { [f.key]: e.target.value })}
                      />
                    ) : (
                      <Input
                        value={(item[f.key] as string) ?? ""}
                        onChange={(e) => update(idx, { [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4 mr-1" />
        {t("admin.contentPage.items.add", { defaultValue: "Add item" })}
      </Button>
    </div>
  );
};

export default SectionItemsEditor;
