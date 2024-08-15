import React from 'react'
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
    href: string;
    label: string;
    active?: boolean
}

const NavButton = ({ href, label, active }: Props) => {
    return (
        <Button asChild size="sm" variant="outline" className={cn("w-full border-none lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-[#666565]border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-[#666565]focus:bg-white/30 transition text-base", active ? " text-[#1c1e25]" : " text-[#666565]")}>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}

export default NavButton