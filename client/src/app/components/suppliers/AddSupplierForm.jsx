"use client";

import { setUi } from '@/app/globalRedux/features/ui/uiSlice';
import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';


export default function AddSupplierForm() {
    const dispatch = useDispatch();
    const showAddSupplierForm = useSelector((state)=> state.ui.showAddSupplierForm);

  // formik
  const handleSubmit = (values, actions) => {
    console.log('form');
  }
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      country: '',
      streetAdress: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
    },
    onSubmit: handleSubmit,
  });
  return (
    <>
    {showAddSupplierForm &&
    <section className='fixed w-[100vw] h-[100vh] z-10 overflow-y-auto' >
      <div className="flex justify-center items-center my-10 " >

        <div className='flex flex-col justify-center items-center gap-5 bg-white
                w-1/2 px-10 h-max py-10 rounded-lg shadow-md shadow-gray-400 z-50' >

            <div className='w-full pb-5' >
                <h1 className='text-black text-xl font-bold text-start' >Add Supplier</h1>
            </div>

            <form autoComplete='off'
                onSubmit={formik.handleSubmit}
                className='w-full flex flex-col gap-5 text-sm'>

                {/* <div className='flex gap-2 sm:gap-5 w-full' >
                    <div className='w-1/2 flex flex-col gap-2' >
                    <label htmlFor="firstName">First name *</label>
                    <input type="text" name='firstName'
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-5 py-2 sm:py-3 text-gray-400' />
                    </div>
                    <div className='w-1/2 flex flex-col gap-2' >
                    <label htmlFor="lastName">Last name *</label>
                    <input type="text" name='lastName'
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-5 py-2 sm:py-3 text-gray-400' />
                    </div>
                </div> */}

                {/* company name */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="companyName">Supplier Name</label>
                    <input type="text" name='companyName'
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        placeholder='Supplier name'
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* country */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="country">country *</label>
                    <input type="text" name='country'
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* street adress */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="streetAdress">Street adress *</label>
                    <input type="text" name='streetAdress'
                        value={formik.values.streetAdress}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* state */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="state">state *</label>
                    <input type="text" name='state'
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>


                {/* zip code */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="zipCode">Zip code *</label>
                    <input type="text" name='zipCode'
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* phone */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="phone">Phone *</label>
                    <input type="text" name='phone'
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>

                {/* email */}
                <div className='w-full flex flex-col gap-2' >
                    <label htmlFor="email">Email *</label>
                    <input type="text" name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className='border border-gray-300
                        px-3 sm:px-4 py-2 sm:py-3 text-gray-400
                        rounded-lg' />
                </div>
                
                <div className='w-full flex justify-center items-center' >
                    <button className='w-3/5 px-10 py-2 bg-primary text-gray-200
                        hover:bg-green-800 rounded-md shadow-md shadow-gray-400' >Add Supplier</button>
                </div>

            </form>

        </div>
        </div>
        {/* overlay   */}
        <div className='fixed top-0 right-0 z-20 w-[100vw] h-[100vh] flex justify-center items-center
          bg-black/70'
          onClick={()=> dispatch(setUi({key: 'showAddSupplierForm', value: false}))} >
        </div>
    </section>} 
    </>
  )
}
