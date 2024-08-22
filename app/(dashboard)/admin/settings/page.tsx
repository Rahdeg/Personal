"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { ToggleCard } from './toogle-card';
import { AlertLevel } from './alert-level';
import { useNewAdmin } from '@/features/admin/hooks/use-new-admin';
import { useGetAdmins } from '@/features/admin/api/use-get-admins';
import { CurrencyType } from './currency-type';
import { LanguageSelector } from './language-selector';


const SettingsPage = () => {
    const { onOpen } = useNewAdmin();
    const adminQuery = useGetAdmins();

    const admins = adminQuery.data || [];


    return (
        <div className=' max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 flex-row items-center justify-between'>
                    <CardTitle className=' flex flex-col items-start justify-center'>
                        <h1 className=' text-2xl font-bold text-blue-900'>
                            Admin Settings
                        </h1>
                        <p className=' text-base text-blue-900'>Set Admin privilege
                        </p>
                    </CardTitle>
                    <div className=' flex flex-col md:flex-row items-center justify-center gap-2'>
                        <Button className='text-base bg-blue-900 text-white ' onClick={onOpen}>
                            <p className=' mr-2'>Add Admin</p>
                        </Button>
                        {/* <Button variant="outline" className='text-base text-blue-900 '>
                            <p className=' mr-2'>UnPaid Order</p>
                        </Button> */}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="my-4">

                        <Button variant="outline" className='text-xl font-bold text-blue-900'>
                            Admins ( {admins.length})
                        </Button>


                    </div>
                    {
                        admins.length ? (<div className="space-y-4">
                            {
                                admins.map((admin) => (
                                    <div key={admin.id} >
                                        <ToggleCard
                                            label={admin.email}
                                            username={admin.name}
                                            value={admin.isAdmin}
                                            id={admin.id}
                                        />

                                    </div>
                                ))
                            }
                        </div>) : (
                            <div className=' flex items-center justify-center'>
                                <p>No Admin Added yet, Please click on Add Admin</p>
                            </div>
                        )

                    }





                    <div className="my-4">

                        <Button variant="outline" className='text-xl font-bold text-blue-900  mb-3'>
                            Alert level
                        </Button>

                        <AlertLevel

                            label="Stock alert level"

                        />


                    </div>

                    <div className="my-4">

                        <Button variant="outline" className='text-xl font-bold text-blue-900  mb-3'>
                            Currency
                        </Button>


                        <CurrencyType label='Set Currency ' />
                    </div>


                </CardContent>
            </Card>

        </div>
    )
}

export default SettingsPage