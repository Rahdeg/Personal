"use client"
import { useGetAdmins } from '@/features/admin/api/use-get-admins';
import useStockAlert from '@/hooks/stock-level';
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import React from 'react'

const WelcomeMsg = () => {

    const { user, isLoaded } = useUser();

    const stockLevel = useStockAlert();

    const router = useRouter();

    const adminQuery = useGetAdmins();
    const admins = adminQuery.data || [];

    const currentAdmin = admins.filter(admin => admin.email === user?.emailAddresses[0].emailAddress)

    const availableProducts = stockLevel.totalAvailableStocks;



    return (
        <div className=' space-y-2 mb-4'>
            <div className=' flex items-center justify-between'>
                <h2 className=' text-2xl lg:text-4xl text-white font-medium'>
                    Welcome Back {isLoaded ? ", " : " "} {user?.firstName ? user?.firstName : currentAdmin[0]?.name ?? ""} 👋🏾
                </h2>
                {
                    availableProducts < stockLevel.stockLevelAlert && (
                        <button
                            className=" bg-red-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded animate-bounce"
                            onClick={() => router.push("/admin/products")}
                        >
                            Low Stock <span className=' ml-2'> ({availableProducts})</span>
                        </button>
                    )
                }

            </div>

            <p className=' text-sm lg:text-base text-[#89b6fd]'>
                This is your Store Overview Report
            </p>
        </div>
    )
}

export default WelcomeMsg