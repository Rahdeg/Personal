
import Header from '@/components/header';
import { client } from '@/lib/hono';
import { SignOutButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react'


type Props = {
    children: React.ReactNode;
}

const DashboardLayout = async ({ children }: Props) => {

    const user = await currentUser()


    const response = await client.api.admin.$get();
    const { data } = await response.json();

    const isAdmin = data.some(admin => admin.email === user?.emailAddresses[0].emailAddress);


    if (!isAdmin && user?.publicMetadata.userId !== process.env.NEXT_ADMIN_ID) {
        return (
            <div className=' w-full h-screen  flex items-center justify-center bg-red-300'>
                <p className=' items-center justify-center flex flex-col'>
                    You are not authorized to access this page Request for Permission. <span className=''>
                        <Link href="/">Goto Hompage</Link>
                    </span>
                </p>
            </div>
        )
    }



    return (
        <>
            <Header />
            <main className='px-3 lg:px-14'>
                {children}
            </main>

        </>
    )
}

export default DashboardLayout