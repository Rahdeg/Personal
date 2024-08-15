'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { FaCalculator } from 'react-icons/fa'
import { Inbox, ListOrdered } from 'lucide-react'


const MyAccount = () => {
    return (
        <FaCalculator className=' size-4' />
    )
}

const AccountPage = () => {
    return (
        <div>
            <h1>Custom Account Page</h1>
            <p>This is the custom Account page</p>
        </div>
    );
};

const MyOrders = () => {
    return (
        <ListOrdered className=' size-4' />
    )
}

const OrderPage = () => {
    return (
        <div>
            <h1>Custom Order Page</h1>
            <p>This is the custom Order page</p>
        </div>
    );
};


const MyInbox = () => {
    return (
        <Inbox className=' size-4' />
    )
}

const InboxPage = () => {
    return (
        <div>
            <h1>Custom Inbox Page</h1>
            <p>This is the custom Inbox page</p>
        </div>
    );
};


export const AvatarIcon = () => {

    return (
        <>
            <SignedOut>
                <Button variant="outline" className=' bg-[#ed5221]'>
                    <SignUpButton />
                </Button>

            </SignedOut>
            <SignedIn>

                <UserButton userProfileMode='navigation' userProfileUrl='/user-profile'>
                    {/* You can pass the content as a component */}
                    <UserButton.UserProfilePage
                        label="Account"
                        url="account"
                        labelIcon={<MyAccount />}
                    >
                        <AccountPage />
                    </UserButton.UserProfilePage>

                    <UserButton.UserProfilePage
                        label="Order"
                        url="order"
                        labelIcon={<MyOrders />}
                    >
                        <OrderPage />
                    </UserButton.UserProfilePage>

                    <UserButton.UserProfilePage
                        label="Inbox"
                        url="inbox"
                        labelIcon={<MyInbox />}
                    >
                        <InboxPage />
                    </UserButton.UserProfilePage>
                </UserButton>

            </SignedIn>

        </>


    )
}


