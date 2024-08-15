

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import WelcomeMsg from "@/components/welcome-msg";
// import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
// import { Button } from "@/components/ui/button";
// import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ImagePlus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Filters } from "@/components/filters";
import { DataCharts } from "@/components/data-charts";

export default function Home() {


  return (
    <div className=" max-w-screen-2xl mx-auto w-full pb-10 -mt-24">

      <DataGrid />
      <DataCharts />

    </div>
  );
}
