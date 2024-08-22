"use client"
import React from 'react'

import Wrapper from './wrapper'
import Toggle, { ToggleSkeleton } from './toogle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Info, ListOrdered, PersonStanding, User } from 'lucide-react'

const Sidebar = () => {
    const { collapsed } = useSidebar((state) => state);
    const pathname = usePathname();

    return (
        <Wrapper>
            <Toggle />
            <div className=' space-y-4 pt-4  lg:pt-0'>
                <Button
                    variant="ghost"
                    asChild
                    className={cn("w-full h-12", collapsed ? "justify-center" : "justify-start", pathname.includes("/user-profile") && "bg-accent")}
                >
                    <Link href="/user-profile">
                        <div className={cn(" flex items-center w-full gap-x-4", collapsed && "justify-center")}>
                            <User />
                            {
                                !collapsed && (
                                    <p className=" truncate">
                                        Profile
                                    </p>
                                )
                            }
                        </div>
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    asChild
                    className={cn("w-full h-12", collapsed ? "justify-center" : "justify-start", pathname.includes("orders") && "bg-accent")}
                >
                    <Link href="/orders">
                        <div className={cn(" flex items-center w-full gap-x-4", collapsed && "justify-center")}>
                            <ListOrdered />
                            {
                                !collapsed && (
                                    <p className=" truncate">
                                        Orders
                                    </p>
                                )
                            }
                        </div>
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    asChild
                    className={cn("w-full h-12", collapsed ? "justify-center" : "justify-start", pathname.includes("reviews") && "bg-accent")}
                >
                    <Link href="/reviews">
                        <div className={cn(" flex items-center w-full gap-x-4", collapsed && "justify-center")}>
                            <PersonStanding />
                            {
                                !collapsed && (
                                    <p className=" truncate">
                                        Pending Reviews
                                    </p>
                                )
                            }
                        </div>
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    asChild
                    className={cn("w-full h-12", collapsed ? "justify-center" : "justify-start", pathname === "/message" && "bg-accent")}
                >
                    <Link href="/message">
                        <div className={cn(" flex items-center w-full gap-x-4", collapsed && "justify-center")}>
                            <Info />
                            {
                                !collapsed && (
                                    <p className=" truncate">
                                        Messages
                                    </p>
                                )
                            }
                        </div>
                    </Link>
                </Button>
            </div>
        </Wrapper>
    )
}

export default Sidebar

export const SidebarSkeleton = () => {
    return (
        <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
            <ToggleSkeleton />
            <ul className="px-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} />
                ))}
            </ul>
        </aside>
    );
};
