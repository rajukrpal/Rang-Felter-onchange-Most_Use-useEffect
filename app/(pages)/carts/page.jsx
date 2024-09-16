"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaArrowAltCircleLeft } from "react-icons/fa";


function cart() {
    const [addToProductList, setAddToProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const storedProducts = JSON.parse(localStorage.getItem('product')) || [];
        setAddToProductList(storedProducts);
        setLoading(false);
    }, []);

    const removeToCart = (product) => {
        const updatedCart = addToProductList.filter(
            (item) => {
                console.log("🚀 ~ removeToCart ~ item:", item)
                return item.time !== product.time
            }
        );

        setAddToProductList(updatedCart);
        localStorage.setItem('product', JSON.stringify(updatedCart));

        console.log('Product removed from cart:', product);
    };



    return (
        <>
            <div className='bg-gray-800 h-screen'>
                <div className='flex items-center gap-5 px-5'>
                    <div className='text-blue-500'>
                        <Link href={'/'}><FaArrowAltCircleLeft className='' size={25} /></Link>
                    </div>
                    <center>
                        <div className='py-2 font-semibold text-xl text-cyan-300    '>Add Your Products List</div>
                    </center>
                </div>
                {
                    loading ? (
                        <div className="flex items-center justify-center min-h-[90vh]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className='grid grid-cols-12 gap-5 md:px-5 px-10 pt-5 overflow-y-scroll h-[80vh]'>
                            {
                                addToProductList.map((product, index) => (
                                    <div key={product?.time || index} className='xl:col-span-2 lg:col-span-3 md:col-span-4 col-span-12  '>
                                        <div className="max-w-sm my-5 overflow-hidden rounded-lg shadow-lg bg-white ">
                                            <div className="flex justify-center  ">
                                                <Image
                                                    height={288}
                                                    width={1000}
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-40 object-contain p-5"
                                                />
                                            </div>

                                            <div className="p-3">
                                                <h2 className="font-bold mb-1 text-gray-900 truncate ">{product.title}</h2>
                                                <p className="text-gray-400 text-sm mb-1 truncate">{product.description}</p>
                                                <p className="text-gray-900 font-semibold mb-1"> ₹ {product.price}</p>
                                                <p className="text-gray-700 mb-1 ">Category: {product.category}</p>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500 text-sm">
                                                        {"★".repeat(Math.round(product.rating.rate))}
                                                    </span>
                                                    <span className="ml-2 text-gray-700 text-sm">({product.rating.count})</span>
                                                </div>
                                                <div className='flex justify-between my-2'>
                                                    <button className=' font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#f05635]' onClick={() => removeToCart(product)}>Remove Cart</button>
                                                    <button className='font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#FFA726]'>Buy now</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

                {/* Footer part */}
                <footer className="bg-gray-800 text-white py-6 sticky bottom-0 px-3">
                    <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        {/* Footer Left: Name */}
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-semibold">Raju Kumar Pal</h4>
                            <p className="text-sm">Frontend Developer & React Enthusiast</p>
                        </div>

                        {/* Footer Center: Social Links */}
                        <div className="space-x-4">
                            <a href="https://linkedin.com/in/rajukrpal" target='_blank' className="text-gray-300 hover:text-gray-400">
                                LinkedIn
                            </a>
                            <a href="https://github.com/rajukrpal" target='_blank' className="text-gray-300 hover:text-gray-400">
                                GitHub
                            </a>
                            <a href="mailto:rajukumarpal95@gmail.com" target='_blank' className="text-gray-300 hover:text-gray-400">
                                Email
                            </a>
                        </div>

                        {/* Footer Right: Copyright */}
                        <div className="text-sm text-gray-400">
                            <p>&copy; {new Date().getFullYear()} Raju Kumar Pal. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>

    )
}


export default cart