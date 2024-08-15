import React from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
    href: string;
    label: string;
    active?: boolean
}

const NavButton = ({ href, label, active }: Props) => {
    return (
        <Button asChild size="sm" variant="outline" className={cn("w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition", active ? "bg-white/10 text-white" : " bg-transparent")}>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}

export default NavButton