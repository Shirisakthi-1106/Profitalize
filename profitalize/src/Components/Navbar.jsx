import React from 'react'
import {NavLink} from 'react-router-dom'

const Navbar = () => {
  return (
    <aside className='fixed left-0 top-0 h-full w-64 backdrop-blur-md bg-gradient-to-b from-slate-900/95 via-blue-900/95 to-indigo-900/95 border-r border-white/10 shadow-2xl z-10 flex flex-col'>
 
        <div className='p-6 border-b border-white/10'>
            <NavLink 
                to='/' 
                className='group relative w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2'
            >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    Profitalize
                </span>
            </NavLink>
        </div>

    
        <nav className='flex flex-col gap-2 p-6 flex-1'>
            <NavLink 
                to='/' 
                className={({isActive}) => 
                    `relative w-full px-6 py-4 font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group flex items-center gap-3 ${
                        isActive ? 'text-white bg-white/10' : ''
                    }`
                }
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                Home
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 group-hover:w-1 transition-all duration-300 rounded-l-full"></span>
            </NavLink>

            <NavLink 
                to='/products'
                className={({isActive}) => 
                    `relative w-full px-6 py-4 font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group flex items-center gap-3 ${
                        isActive ? 'text-white bg-white/10' : ''
                    }`
                }
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
                Products
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 group-hover:w-1 transition-all duration-300 rounded-l-full"></span>
            </NavLink>

            <NavLink 
                to='/profits'
                className={({isActive}) => 
                    `relative w-full px-6 py-4 font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group flex items-center gap-3 ${
                        isActive ? 'text-white bg-white/10' : ''
                    }`
                }
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                Profits
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 group-hover:w-1 transition-all duration-300 rounded-l-full"></span>
            </NavLink>
        </nav>


        <div className='p-6 border-t border-white/10'>
            <div className='text-center text-white/60 text-sm'>
                © 2025 Profitalize
            </div>
        </div>
    </aside>
  )
}

export default Navbar