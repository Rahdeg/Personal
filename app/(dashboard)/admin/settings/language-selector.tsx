import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAppState from "@/hooks/app-states";
import { useRouter } from "next/router";




export const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const { locale, locales } = router;

  const changeLanguage = (lng: string) => {
    router.push(`/${lng}`);
  };

  return (
    <select onChange={(e) => changeLanguage(e.target.value)} value={locale}>
      {locales?.map((lng) => (
        <option key={lng} value={lng}>
          {lng}
        </option>
      ))}
    </select>
  );
};
