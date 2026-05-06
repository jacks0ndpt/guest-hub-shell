import { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Props = {
  bucket: string;
  pathPrefix?: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export const ImageUploader = ({ bucket, pathPrefix = "", value, onChange, label = "Image" }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${pathPrefix}${pathPrefix ? "-" : ""}${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "Image uploaded" });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && (
        <div className="relative">
          <img src={value} alt="" className="w-full max-h-56 object-cover rounded-md border border-border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-background/90 rounded-full p-1 border border-border"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL or upload" />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
};

export default ImageUploader;
