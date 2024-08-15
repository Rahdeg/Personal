"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import Actions from "./actions";
import { format } from 'date-fns'
import { formatCurrency } from "@/lib/utils";


interface ProductInitialData {
  name?: string;
  categoryId?: string;
  price?: string;
  isFeatured?: boolean;
  isArchived?: boolean;
  colorIds?: string[];
  sizeIds?: string[];
}

export type ResponseType = InferResponseType<typeof client.api.products.$get, 200>["data"][0];

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  }, {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },


  {
    accessorKey: "categoryName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  // {
  //   accessorKey: "costPrice",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Cost Price
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   }
  // },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <p>{formatCurrency(row.original.sellingPrice)}</p>
    )
  },
  {
    accessorKey: "colors",
    header: "Colors",
    cell: ({ row }) => (
      <div className="grid grid-cols-2  gap-y-1">
        {row.original.colors.map((color, index) => (
          <button
            key={index}
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: color }}
          >

          </button>
        ))}
      </div>
    )
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
    cell: ({ row }) => (
      <div className="grid grid-cols-2  gap-y-1">
        {row.original.sizes.map((size, index) => (
          <Button
            key={index}
            className="h-10 w-14 bg-blue-600 "

          >
            {size}
          </Button>
        ))}
      </div>
    )
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
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
