"use client"
import { getProductData } from '@/productApi'
import React, { useEffect, useState } from 'react'
import { Slider } from "@nextui-org/react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaOpencart } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





function FilterData() {
    const [saveProductData, setSaveProductData] = useState([])
    const [filterProductData, setFilterProductData] = useState([])
    const [formData, setFormData] = useState({
        srartrenge: 50,
        endrang: 300,
    })
    const [value, setValue] = useState([50, 300]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchData, setSearchData] = useState("");
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [isMenuShow, setIsMenuShow] = useState(true);
    const [loading, setLoading] = useState(true);
    const [addToProduct, setAddToProduct] = useState([]);
    const [addToProductList, setAddToProductList] = useState([]);

    const starColors = ['text-red-500', 'text-yellow-500', 'text-blue-900', 'text-purple-900', 'text-green-500']; // star color



    // ------- use useEffect than run Application Ans show imidatly data For API ------- ⬇
    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const chack = await getProductData()
                setLoading(false);
                setSaveProductData(chack)
                setFilterProductData(chack)
            } catch (error) {
                console.log(error)
            }

        }
        getData()
    }, [])

    // ------- use useEffect use for felter SEARCH input ------------ ⬇
    useEffect(() => {
        if (!searchData) {
            setFilterProductData(saveProductData);
            return;
        }
        const searchResult = saveProductData.filter(
            (product) =>
                product.title?.toString().toLowerCase().includes(searchData.toLowerCase()) ||
                product.category?.toString().toLowerCase().includes(searchData.toLowerCase())
        );
        setFilterProductData(searchResult);
        console.log("searchResult", searchResult)
    }, [saveProductData, searchData]);


    // ------- Temprorly NOT use ----------- ⬇
    const handleSubmit = (e) => {
        e.preventDefault()
        const fielterData = saveProductData.filter((item) =>
            item.price >= formData.srartrenge && item.price <= formData.endrang
        )
        setFilterProductData(fielterData)
        setFormData({
            srartrenge: "",
            endrang: "",
        })
    }

    // -------- onChange Function ------------ ⬇
    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({

            ...prevFormData,
            [name]: value,

        }));
    };

    // --------- use useEffect for formData value change and felter product -------- ⬇
    useEffect(() => {
        if (formData.srartrenge) {
            if (formData.endrang) {
                const fielterData = saveProductData.filter((item) => {
                    return item.price >= formData.srartrenge && item.price <= formData.endrang
                })

                setFilterProductData(fielterData)
            }

        }
    }, [formData])

    // -------- install Slider function -------- ⬇
    const handleSliderChange = (newValue) => {
        setValue(newValue);
        setFormData({
            srartrenge: newValue[0],
            endrang: newValue[1],
        });
    };

    //  ----------- Dropdown select and felter data------------ ⬇
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = (selectedCategory) => {
        const searchResult = saveProductData.filter(
            (product) => product.category.toString().toLowerCase() === selectedCategory.toLowerCase()
        );
        setFilterProductData(searchResult);
        setIsOpen(false);
    };

    // ------------ chack box se felter karne ke liye handleRatingChange function part-1 ------------ ⬇⬇
    const handleRatingChange = (e) => {
        const value = parseInt(e.target.value);
        setSelectedRatings((prevRatings) => {
            console.log("🚀 ~ setSelectedRatings ~ prevRatings:", prevRatings)
            if (prevRatings.includes(value)) {
                return prevRatings.filter((rating) => {
                    return rating !== value
                })
            } else {
                return [...prevRatings, value];
            }
        });
    };
    // --------- chack box par jese jese felter ho jaye wese wese data show hone lage part-2 --------- ⬇⬇
    useEffect(() => {
        if (selectedRatings.length === 0) {
            setFilterProductData(saveProductData);
            return;
        }
        const filteredData = saveProductData.filter((product) =>
            selectedRatings.includes(Math.round(product.rating.rate))
        );
        setFilterProductData(filteredData);
    }, [selectedRatings, saveProductData]);

    // ----------  sidebar show and close -------- ⬇
    const toggleShowMenu = () => {
        setIsMenuShow(prevState => !prevState);
    };

    // ---------- AddtoProduct function ----------- ⬇

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




    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('product')) || [];
        setAddToProduct(storedProducts);
    }, []);


    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('product')) || [];
        setAddToProductList(storedProducts);
    }, []);

    return (
        <>
            <div className='w-full  flex h-screen bg-gray-900 '>
                <ToastContainer position='top-center' autoClose={1000}/>
                {/* SideBar  */}
                <div className={` ${isMenuShow === true ? 'w-80 lg:block hidden translate-x-0' : 'fixed w-60 lg:hidden block -translate-x-full'}transition-transform duration-300 ease-in-out top-0 left-0 bg-gradient-to-bl from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen z-10 `}>
                    <div>
                        <div className='md:py-3 py-4 font-bold lg:text-xl text-sm  uppercase gradient-text cursor-pointer ' onClick={toggleShowMenu}><center>click heare </center> </div>
                        <div>
                            <center className='capitalize font-semibold text-blue-300 py-2'>select price</center>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className='flex gap-3 justify-center'>
                                        <input onChange={onChange} value={formData.srartrenge} name="srartrenge" placeholder='Start' className='outline-none text-black bg-slate-200 rounded-md px-2 py-1 w-16' type="text" />
                                        <span className='flex items-center '>-</span>
                                        <input onChange={onChange} value={formData.endrang} name='endrang' placeholder='End' className='outline-none bg-slate-200 text-black rounded-md  w-16 px-2 py-1' type="text" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Range felter */}
                    <div className='py-4'>
                        <h4 className='capitalize py-1 font-semibold text-blue-200'><center>Selete felter Renge</center></h4>
                        <div className='flex justify-center'>
                            <div className='w-52'>
                                <Slider
                                    // label="Select Price Range"
                                    formatOptions={{ style: "currency", currency: "USD" }}
                                    step={10}
                                    maxValue={1000}
                                    minValue={0}
                                    value={value}
                                    onChange={handleSliderChange}
                                    className="max-w-md"
                                />
                            </div>
                        </div>
                    </div>
                    {/* chack box and felter star reateng */}
                    <div>
                        <h4><center className='capitalize font-semibold text-blue-100'>Select Rating Star</center></h4>
                        <div className='flex gap-5 justify-center pb-4 pt-2'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className='flex flex-col items-center'>
                                    <input
                                        type="checkbox"
                                        value={star}
                                        onChange={handleRatingChange}
                                        checked={selectedRatings.includes(star)}
                                    />
                                    <span className={`${starColors[star - 1]}`}>{star}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* selete Dropdown with Categry */}
                    <div>
                        <center>
                            <div className='w-full py-6 pb-8'>
                                <div className="relative inline-block">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center"
                                        onClick={toggleDropdown}
                                    >
                                        Dropdown <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </button>

                                    {isOpen && (
                                        <div className="origin-top-right absolute -right-8 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <ul className='border rounded-lg h-32 overflow-y-scroll no-scrollbar' role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                {[...new Set(saveProductData.map((product) => product.category))].map((category, index) => (
                                                    <li key={category || index}>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => closeDropdown(category)}
                                                        >
                                                            {category}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
                {/* Body Part */}

                <div className=' w-full overflow-y-scroll  '>
                    <div className=' sticky top-0 py-3 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% flex justify-between items-center px-5'>
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
                        <div className="flex items-center gap-4">
                            {/* Search Input */}
                            <input
                                className="md:w-96 w-32 py-2 px-4 rounded-xl outline-none border-2 border-gray-300 focus:border-blue-400 transition duration-300"
                                placeholder="Search..."
                                onChange={(e) => setSearchData(e.target.value)}
                                type="search"
                            />
                            {/* shoping cart */}
                            <Link href={'/carts'}><div className="relative ">
                                <FaOpencart size={30} className="text-blue-600" />
                                <span className="h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs absolute -top-2 -right-2">
                                    {addToProductList.length}
                                </span>
                            </div></Link>
                        </div>

                    </div>
                    {/* Add Card component */}
                    {
                        loading ? (
                            <div className="flex items-center justify-center min-h-[85vh] border">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-12 gap-5 md:px-5 px-10 pt-5 min-h-[85vh]'>
                                {
                                    filterProductData.map((product, index) => (
                                        <div key={product?.id || index} className='xl:col-span-2 lg:col-span-3 md:col-span-4 col-span-12  '>
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
                                                        <button className=' font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#2B94E6]' onClick={() => addToCart(product)}>Add to card</button>

                                                        <button className='font-semibold text-white px-2 py-1 rounded-md text-sm bg-[#FFA726]'>Buy now</button>
                                                    </div>

                                                    {
                                                        addToProductList.map((item) => (


                                                            product.id === item.id ? (
                                                                <span key={product.id} className='capitalize text-[12px] flex items-center gap-1 text-green-400'><IoCheckmarkDoneCircle size={20} />add to cart</span>
                                                            ) : (
                                                                ""
                                                            )

                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}

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
            </div >
        </>
    )
}

export default FilterData
