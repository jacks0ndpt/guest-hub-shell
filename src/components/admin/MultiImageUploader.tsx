import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Props = {
  bucket: string;
  pathPrefix?: string;
  values: string[];
  onChange: (urls: string[]) => void;
};

export const MultiImageUploader = ({ bucket, pathPrefix = "", values, onChange }: Props) => {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${pathPrefix}${pathPrefix ? "-" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (error) {
        toast({ title: `${t("common.uploadFailed")}: ${file.name}`, description: error.message, variant: "destructive" });
        continue;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    onChange([...values, ...uploaded]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {values.map((url, i) => (
          <div key={url + i} className="relative group rounded-md overflow-hidden border border-border">
            <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 bg-background/90 rounded-full p-1"
              aria-label={t("common.remove")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="absolute bottom-1 left-1 flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="bg-background/90 px-1.5 rounded text-xs">←</button>
              <button type="button" onClick={() => move(i, 1)} className="bg-background/90 px-1.5 rounded text-xs">→</button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {t("common.uploadImages")}
      </Button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
    </div>
  );
};

export default MultiImageUploader;
