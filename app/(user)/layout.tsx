

import React, { Suspense } from 'react'
import Header from '../(products)/_components/header';
import Sidebar, { SidebarSkeleton } from './_components/sidebar';
import { Container } from './_components/container';



type Props = {
    children: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
    return (
        <div className='bg-[#ffffff]'>
            <Header />
            <div className='flex h-full pt-20 '>
                <Suspense fallback={<SidebarSkeleton />}>
                    <Sidebar />
                </Suspense>

                <Container>
                    {children}
                </Container>

            </div>
        </div>
    )
}

export default UserLayout