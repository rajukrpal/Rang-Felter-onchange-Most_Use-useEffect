"use client"
import { getProductData } from '@/productApi'
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

    useEffect(() => {
        const getData = async () => {
            const chack = await getProductData()
            setSaveProductData(chack)
            setFilterProductData(chack)
        }
        getData()
    }, [])

    // hendle submit
    const handleSubmit = (e) => {
        e.preventDefault()
        const fielterData = saveProductData.filter((item) =>
            item.price >= formData.srartrenge && item.price <= formData.endrang
        )
        setFilterProductData(fielterData)

        // setFormData({
        //     srartrenge: "",
        //     endrang: "",
        // })

    }


    // onChange Function
    const onChange = (e) => {
        // console.log("formData---------->", formData)

        const { name, value } = e.target;
        setFormData((prevFormData) => ({

            ...prevFormData,
            [name]: value,

        }));
    };

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

    const handleSliderChange = (newValue) => {
        // console.log("newValuenewValue",newValue)
        setValue(newValue);
        setFormData({
            srartrenge: newValue[0],
            endrang: newValue[1],
        });
    };

    return (
        <>
            <div className='flex'>
                <form onSubmit={handleSubmit}>
                    <div className='flex gap-5 py-3 px-6'>
                        <input onChange={onChange} value={formData.srartrenge} name="srartrenge" placeholder='Start' className='bg-slate-200 rounded-md px-4 w-32' type="number" />
                        <input onChange={onChange} value={formData.endrang} name='endrang' placeholder='End' className='bg-slate-200 rounded-md px-4 w-32' type="number" />
                        <button className='border p-1 px-2 bg-blue-500 rounded-md' type='submit'>Go</button>
                    </div>
                </form>
                <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center px-20 py-5">
                    <Slider
                        label="Select Price Range"
                        formatOptions={{ style: "currency", currency: "USD" }}
                        step={10}
                        maxValue={1000}
                        minValue={1}
                        value={value}
                        onChange={handleSliderChange}
                        className="max-w-md"
                    />
                </div>
            </div>
            <div className='flex gap-10'>
                <div>
                    {
                        saveProductData.map((item) => (
                            <div className='px-5 py-1' key={item.id}>
                                {item.price}
                            </div>
                        ))
                    }
                </div>
                <div>
                    {
                        filterProductData.map((item) => (
                            <div className='px-5 py-1' key={item.id}>
                                {item.price}
                            </div>
                        ))
                    }
                </div>
                <div className='px-8'>

                </div>
            </div>


        </>
    )
}

export default FilterData



