"use client"


import useAppState from "@/hooks/app-states";
import { useEffect, useState } from "react";



interface CurrencyProps {
  value?: string | number
}

const Currency: React.FC<CurrencyProps> = ({
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { currency: myCurrency } = useAppState();

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: myCurrency
  });

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null;
  }

  return (
    <div className=" font-semibold">
      {formatter.format(Number(value))}
    </div>
  )
}

export default Currency