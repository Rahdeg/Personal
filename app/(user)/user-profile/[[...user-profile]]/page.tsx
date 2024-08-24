"use client";


import Header from '@/app/(products)/_components/header';
import { UpdateUser } from '@/features/users/components/user-update-card';
import { UserProfile } from '@clerk/nextjs';
import { Inbox, ListOrdered } from 'lucide-react';
import { FaCalculator } from 'react-icons/fa';

const MyAccount = () => {
    return (
        <FaCalculator className=' size-4' />
    )
}

// const MyOrders = () => {
//     return (
//         <ListOrdered className=' size-4' />
//     )
// }

// const OrderPage = () => {
//     return (
//         <div>
//             <h1>Custom Order Page</h1>
//             <p>This is the custom Order page</p>
//         </div>
//     );
// };




const UserProfilePage = () => (
    <div className='bg-[#ffffff]'>
        <Header />

        <main className=' mt-24 w-full flex items-center justify-center h-full'>
            <UserProfile path="/user-profile" routing="path">
                <UserProfile.Page
                    label="Account"
                    labelIcon={<MyAccount />}
                    url="account"
                >
                    <UpdateUser />
                </UserProfile.Page>


            </UserProfile>
        </main>

    </div>

);

export default UserProfilePage;