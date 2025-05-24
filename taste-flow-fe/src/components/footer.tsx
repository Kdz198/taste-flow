import React from 'react'

export default function Footer() {
    return (
        <footer className="py-10 px-6 md:px-12 border-t border-gray-800 bg-[#212121] text-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center mb-4">
                        <img src="https://wallpaperaccess.com/full/3692914.jpg" alt="Forkful Logo" className="w-10 h-10 mr-2 rounded-full" />
                        <h2 className="text-xl font-bold">Forkful</h2>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Forkful creates simple, flavorful meals for every taste and joy.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-orange-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26.81-1.16 1.39-2.09 1.39-.62 0-1.19-.27-1.58-.71-.39-.43-.63-1.02-.63-1.68v-.72l-2.49-2.49c-.56.14-1.14.22-1.74.22-4.42 0-8-3.58-8-8 0-.62.08-1.21.21-1.79L9 9v1c0 1.1.9 2 2 2h1l4.9-4.9c.56.14 1.14.22 1.74.22 1.66 0 3.18-.62 4.34-1.66.26.81.39 1.66.39 2.54 0 4.42-3.58 8-8 8z" /></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-orange-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 15h-3v-4h-2v4H7V7h3v3.59L15 7h3l-5 5 5 5z" /></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-orange-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-1v-2h1v2zm3-2h-1v2h-1v-2h-2v-1h2v-2h1v2h1v1zm-2-5h-1v2h1v-2zm3 2h-1v-2h1v2z" /></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-orange-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-1v-2h1v2zm3-2h-1v2h-1v-2h-2v-1h2v-2h1v2h1v1zm-2-5h-1v2h1v-2zm3 2h-1v-2h1v2z" /></svg>
                        </a>
                    </div>
                </div>


                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-orange-500">All Categories</a></li>
                        <li><a href="#" className="hover:text-orange-500">Site Map</a></li>
                        <li><a href="#" className="hover:text-orange-500">About Us</a></li>
                        <li><a href="#" className="hover:text-orange-500">Help</a></li>
                    </ul>
                </div>

   
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                    <ul className="space-y-2 text-gray-400 mb-4">
                        <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-orange-500">Terms of Service</a></li>
                    </ul>
                    <div className="flex w-full max-w-xs">
                        <input type="email" placeholder="Enter Email" className="w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-l-lg focus:outline-none" />
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600">Submit</button>
                    </div>
                </div>
            </div>

           
            <div className="mt-8 text-center text-gray-500 text-sm">
                © 2025 - All Rights Reserved
            </div>
        </footer>
    )
}
