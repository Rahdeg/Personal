"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import Actions from "./actions";
import { formatAmountToNairaKobo, formatCurrency } from "@/lib/utils";


export type ResponseType = InferResponseType<typeof client.api.orders.$get, 200>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "products",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Products
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {
          row.original.products.map((product) => product.productName).join(', ')
        }
      </div>
    )
  },
  // {
  //   accessorKey: "products",
  //   header: "Color",
  //   cell: ({ row }) => (


  //     <div className="grid grid-cols-2  gap-1">
  //       {row.original.products.map((product, index) => (
  //         <button
  //           key={index}
  //           className="h-6 w-6 rounded-full border"
  //           style={{ backgroundColor: product.color! }}
  //         >

  //         </button>
  //       ))}
  //     </div>
  //   )
  // },
  // {
  //   accessorKey: "products",
  //   header: "Size",
  //   cell: ({ row }) => (


  //     <div className="flex items-center gap-x-2">
  //       {
  //         row.original.products.map((product) => product.size).join(', ')
  //       }
  //     </div>
  //   )
  // },
  {
    accessorKey: "phone",
    header: "Phone"
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          IsPaid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "trackingNumber",
    header: "Tracking Number"
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {
          formatAmountToNairaKobo(row.original.totalAmount!)

        }
      </div>
    )
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {format(row.original.createdAt ?? "", 'MMMM do, yyyy') ?? ""}
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />
  },


];
