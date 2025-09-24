"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    return (
        <div className="pt-5">
            <header className="shadow-[3px_1px_9px_0px_#cecece] py-[20px] bg-white">
                <div className="flex justify-evenly items-center w-full px-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <img
                                className="w-[100px] transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-6"
                                src="https://tv42haber.com//images/tv42logo.png"
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    {/* Menü Butonları ve Canlı Yayın */}
                    <div className="flex items-center space-x-12">
                        <ul className="flex space-x-10">
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">Anasayfa</Link>
                            </li>
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">Yayın Akışı</Link>
                            </li>
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">Programlar</Link>
                            </li>
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">Basın</Link>
                            </li>
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">Reklam</Link>
                            </li>
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">Künye</Link>
                            </li>
                            <li className="transform transition-all duration-300 hover:translate-y-[-5px] hover:text-blue-500">
                                <Link href="" className="font-semibold text-base text-gray-700">İletişim</Link>
                            </li>
                        </ul>

                        {/* Canlı Yayın Butonu */}
                        <div>
                            <button
                                onClick={() => { router.push('/'); }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-500 transform hover:scale-105 hover:translate-y-[-3px] cursor-pointer"
                            >
                                Canlı Yayın
                            </button>
                        </div>
                    </div>

                    {/* Menü İkonu */}
                    <div className="menuIcon">
                        <i className="fa-solid fa-bars text-gray-700 hover:text-blue-500 transition-all duration-300 transform hover:scale-110" aria-hidden="true"></i>
                    </div>
                </div>
            </header>
        </div>
    );
}
