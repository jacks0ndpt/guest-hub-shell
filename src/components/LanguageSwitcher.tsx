import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = ({
  variant = "ghost",
  className,
}: {
  variant?: "ghost" | "outline";
  className?: string;
}) => {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const change = (lng: "en" | "ro") => i18n.changeLanguage(lng);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn("gap-1.5 uppercase text-xs", className)}
          aria-label={t("common.language")}
        >
          <Globe className="h-4 w-4" />
          {current}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => change("en")}>
          {t("common.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => change("ro")}>
          {t("common.romanian")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
