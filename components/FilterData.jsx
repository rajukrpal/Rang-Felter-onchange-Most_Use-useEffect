"use client"
import { getProductData } from '@/productApi'
// import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Slider } from "@nextui-org/react";

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





    // ------- use useEffect than run Application Ans show imidatly data For API ------- ⬇
    useEffect(() => {
        const getData = async () => {
            const chack = await getProductData()
            setSaveProductData(chack)
            setFilterProductData(chack)
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

    const closeDropdown = () => {
        const searchResult = saveProductData.filter(
            (product) =>
                product.category?.toString().toLowerCase().includes(searchData.toLowerCase())
        );
        setFilterProductData(searchResult);
        setIsOpen(false);
    };

    // ------------ chack box se felter karne ke liye handleRatingChange function ------------ ⬇
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
    // --------- chack box par jese jese felter ho jaye wese wese data show hone lage --------- ⬇
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



    return (
        <>
            <div className='w-full border border-red-400 flex h-screen '>
                {/* SideBar  */}
                <div className='border border-green-300 w-80'>
                    {/* Input felter onchange */}
                    <div>
                        <div className='py-3 font-bold text-xl uppercase text-blue-400 border'><center>Felter Product Data </center> </div>
                        <div>
                            <center className='capitalize font-semibold text-blue-300 py-2'>select price</center>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className='flex gap-3 justify-center'>
                                        <input onChange={onChange} value={formData.srartrenge} name="srartrenge" placeholder='Start' className='bg-slate-200 rounded-md px-2 py-1 w-16' type="text" />
                                        <span className='flex items-center '>-</span>
                                        <input onChange={onChange} value={formData.endrang} name='endrang' placeholder='End' className='bg-slate-200 rounded-md  w-16 px-2 py-1' type="text" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Range felter */}
                    <div className='py-4'>
                        <h4 className='capitalize py-1'><center>Selete felter Renge</center></h4>
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
                        <h4><center className='capitalize'>Select Rating Star</center></h4>
                        <div className='flex gap-5 justify-center pb-4 pt-2'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className='flex flex-col items-center'>
                                    <input
                                        type="checkbox"
                                        value={star}
                                        onChange={handleRatingChange}
                                        checked={selectedRatings.includes(star)}
                                    />
                                    <span>{star}</span>
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
                                        Dropdown <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </button>

                                    {isOpen && (
                                        <>
                                            <div className="origin-top-right absolute -right-8 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                <ul className='border border-red-600 h-52 overflow-y-scroll' role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <li>
                                                        {
                                                            saveProductData.map((product) => (
                                                                <a
                                                                    key={product.id}
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={closeDropdown}
                                                                >
                                                                    <span>{product.category}</span>
                                                                </a>
                                                            ))
                                                        }
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
                {/* Body Part */}
                <div className='border border-purple-700 w-full overflow-y-scroll py-3 pb-5 '>
                    <div className='border border-green-500 sticky top-0'>
                        <center>
                            <input className='w-96 border py-1 rounded-xl px-4 border-red-500' placeholder="Search... title & category" onChange={(e) => setSearchData(e.target.value)} type="search" />
                        </center>
                    </div>
                    {/* Add Card component */}
                    <div className='grid grid-cols-12 gap-5 px-5 pt-5'>
                        {
                            filterProductData.map((product) => (
                                <>
                                    <div className='col-span-2 '>
                                        <div className="max-w-sm my-5 overflow-hidden rounded-lg shadow-lg " key={product.id}>
                                            <div className="flex justify-center">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full object-fill h-72 p-5"
                                                />
                                            </div>

                                            <div className="p-3">
                                                <h2 className="font-bold mb-2 text-base truncate ">{product.title}</h2>
                                                <p className="text-gray-600 text-sm mb-3 truncate">{product.description}</p>
                                                <p className="text-gray-900 font-semibold mb-2"> ₹ {product.price}</p>
                                                <p className="text-gray-700 mb-3 ">Category: {product.category}</p>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500 text-sm">
                                                        {"★".repeat(Math.round(product.rating.rate))}
                                                    </span>
                                                    <span className="ml-2 text-gray-700 text-sm">({product.rating.count})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))
                        }

                    </div>
                </div>

            </div>





        </>
    )
}

export default FilterData
