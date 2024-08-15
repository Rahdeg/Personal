"use client"
import { formatDateRange } from '@/lib/utils';
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
// import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"
import { DataCard, DataCardLoading } from './ui/data-card';
import { ProductDataCard } from './ui/data-product-card ';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import useStockAlert from '@/hooks/stock-level';

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary();

    console.log(data, "feee");

    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dateRangeLabel = formatDateRange({ to, from });

    const { setTotalAvailableStocks } = useStockAlert()


    useEffect(() => {
        if (data?.totalProductsQuantityCounts) {
            setTotalAvailableStocks(data?.totalProductsQuantityCounts);
        }

    }, [data, setTotalAvailableStocks])


    if (isLoading) {
        return (
            <div className=' grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />


            </div>
        )
    }






    return (
        <div className=' grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>

            <DataCard
                title="Revenue"
                value={data?.totalRevenue}
                percentageChange={20}
                icon={FaPiggyBank}
                dateRange={dateRangeLabel}
            />

            <DataCard
                title="Expensis"
                value={data?.totalExpenses}
                percentageChange={10}
                icon={FaArrowTrendUp}
                dateRange={dateRangeLabel}
            />



            <DataCard
                title="Net Profit"
                value={data?.netProfit}
                percentageChange={5}
                icon={FaArrowTrendDown}
                dateRange={dateRangeLabel}
            />



        </div>
    )
}
