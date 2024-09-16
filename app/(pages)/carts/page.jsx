"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiMenuFold2Fill } from "react-icons/ri";



function cart() {
    const [addToProductList, setAddToProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuShow, setIsMenuShow] = useState(true);

    useEffect(() => {
        setLoading(true);
        const storedProducts = JSON.parse(localStorage.getItem('product')) || [];
        setAddToProductList(storedProducts);
        setLoading(false);
    }, []);

    const removeToCart = (product) => {
        toast.error("remove product !");
        const existingProduct = addToProductList.find((item) => item.id === product.id);
        if (existingProduct && existingProduct.quantity > 1) {
            const updatedCart = addToProductList.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
            );
            setAddToProductList(updatedCart);
            localStorage.setItem('product', JSON.stringify(updatedCart));
        } else {
            const updatedCart = addToProductList.filter((item) => item.id !== product.id);
            setAddToProductList(updatedCart);
            localStorage.setItem('product', JSON.stringify(updatedCart));
        }
    };

    const addToCart = (product) => {
        toast.success(`product add to cart !`)
        const existingProduct = addToProductList.find((item) => item.id === product.id);
        if (existingProduct) {
            const updatedCart = addToProductList.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setAddToProductList(updatedCart);
            localStorage.setItem('product', JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...addToProductList, { ...product, quantity: 1 }];
            setAddToProductList(updatedCart);
            localStorage.setItem('product', JSON.stringify(updatedCart));
        }
    };

    // ----------  sidebar show and close -------- ⬇
    const toggleShowMenu = () => {
        setIsMenuShow(prevState => !prevState);
    };


    // ----------- caculet produvt --------  ⬇
    const calculateTotalAmount = () => {
        return addToProductList.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    };

    const calculateGST = () => {
        return 12;
    };

    const calculateGSTAmount = () => {
        const totalAmount = calculateTotalAmount();
        return (totalAmount * 0.12);
    };

    const calculateShoppingCharge = () => {
        const totalAmount = calculateTotalAmount();
        if (addToProductList.length === 0) {
            return 0;
        }
        return totalAmount >= 500 ? 0 : 100;
    };

    const calculateFinalAmount = () => {
        const totalAmount = calculateTotalAmount();
        const gstAmount = calculateGSTAmount();
        const shoppingCharge = calculateShoppingCharge();
        return totalAmount + gstAmount + shoppingCharge;
    };





    return (
        <>

            <div className='w-full  flex h-screen bg-gray-900 '>
                {/* SideBar  */}
                <div className={` ${isMenuShow === true ? 'w-80 lg:block hidden translate-x-0' : 'w-60 fixed lg:hidden block -translate-x-full'}transition-transform duration-300 ease-in-out top-0 left-0 bg-gradient-to-bl from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen z-10 `}>
                    <div>
                        <div className='md:py-3 py-4 font-bold lg:text-xl text-sm  uppercase gradient-text cursor-pointer ' onClick={toggleShowMenu}><center>click heare </center> </div>
                        <div>
                            <center className='capitalize font-semibold text-blue-300 py-2'>Order detail</center>
                            <div className='text-center space-y-3'>
                                <h5>GST: {calculateGST().toFixed(2)} % </h5>
                                <h5>Shopping Charge: ₹ {calculateShoppingCharge().toFixed(2)}</h5>
                                <h5>Total Amount: ₹ {calculateTotalAmount().toFixed(2)}</h5>
                                <h5>Final Pay Amount: ₹ {calculateFinalAmount().toFixed(2)}</h5>
                            </div>

                        </div>
                    </div>
                </div>
                {/* carts body part */}
                <div className='bg-gray-900 h-screen w-full overflow-y-scroll'>
                    <ToastContainer position='top-center' autoClose={1000} />
                    <div className='flex items-center px-5 sticky top-0 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% justify-between'>
                        {/*  */}
                        <div className='flex items-center'>
                            <div className='hidden md:flex items-center'>
                                {isMenuShow === false && (
                                    <RiMenuFold2Fill
                                        size={30}
                                        className='gradient-text cursor-pointer'
                                        onClick={toggleShowMenu}
                                    />
                                )}
                            </div>
                            <div className='lg:hidden flex items-center'>
                                {isMenuShow === true && (
                                    <RiMenuFold2Fill
                                        size={30}
                                        className='gradient-text cursor-pointer'
                                        onClick={toggleShowMenu}
                                    />
                                )}
                            </div>
                        </div>
                        {/*  */}

                        <div className='flex  items-center gap-3 py-3 '>
                            <center>
                                <div className='py-2 font-semibold md:text-xl text-cyan-300 text-sm   '>Add Your List</div>
                            </center>
                            <div className='text-blue-500'>
                                <Link href={'/'}><FaArrowAltCircleLeft className='' size={25} /></Link>
                            </div>

                        </div>
                    </div>
                    {
                        loading ? (
                            <div className="flex items-center justify-center min-h-[90vh]">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            </div>
                        ) : (
                            <>
                                {addToProductList.length === 0 ? (
                                    <div className="flex items-center justify-center min-h-[85vh]">
                                        <p className="text-gray-300 text-lg">No products in the cart.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className='grid grid-cols-12 gap-5 md:px-5 px-10 py-5 overflow-y-scroll h-[85vh] '>
                                            {
                                                addToProductList.map((product, index) => (
                                                    <div key={product?.time || index} className='xl:col-span-2 lg:col-span-3 md:col-span-4 col-span-12'>
                                                        <div className="max-w-sm my-5 overflow-hidden rounded-lg shadow-lg bg-white">
                                                            <div className="flex justify-center">
                                                                <Image
                                                                    height={288}
                                                                    width={1000}
                                                                    src={product.image}
                                                                    alt={product.title}
                                                                    className="w-full h-40 object-contain p-5"
                                                                />
                                                            </div>

                                                            <div className="p-3">
                                                                <h2 className="font-bold mb-1 text-gray-900 truncate">{product.title}</h2>
                                                                <p className="text-gray-400 text-sm mb-1 truncate">{product.description}</p>
                                                                <p className="text-gray-900 font-semibold mb-1"> ₹ {product.price}</p>
                                                                <p className="text-gray-700 mb-1">Category: {product.category}</p>
                                                                <div className="flex items-center">
                                                                    <span className="text-yellow-500 text-sm">
                                                                        {"★".repeat(Math.round(product.rating.rate))}
                                                                    </span>
                                                                    <span className="ml-2 text-gray-700 text-sm">({product.rating.count})</span>
                                                                </div>
                                                                <div className='flex justify-between my-2'>
                                                                    <div className='flex gap-2 items-center'>
                                                                        <button className='font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#f05635]' onClick={() => removeToCart(product)}><span className=''>-</span></button> <span className='text-gray-400 text-sm'>{product.quantity}</span> <button className='font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#6ef064]' onClick={() => addToCart(product)}><span>+</span></button>
                                                                    </div>
                                                                    <button className='font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#FFA726]'>Buy now</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )}
                            </>
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
            </div>
        </>

    )
}


export default cart


