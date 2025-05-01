import React from 'react'

const Header = ({ setShowLogoutModal }) => {
    return (
        <header className="flex justify-between  bg-emerald-300 px-6 py-3" >
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button onClick={() => setShowLogoutModal(true)} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Logout</button>
        </header>
    )
}

export default Header