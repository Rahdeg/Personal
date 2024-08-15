
import React from 'react'
import { Searchs } from './search'
import { Carts } from './cart'
import { AvatarIcon } from './avatar'


const Profile = () => {
    return (
        <div className=' flex items-center justify-center gap-x-3'>
            <Searchs />
            <Carts />
            <AvatarIcon />

        </div>
    )
}

export default Profile