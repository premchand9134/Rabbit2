import React, {  useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from '../Components/Products/FilterSidebar'
import Sortoptions from '../Components/Products/Sortoptions'
import ProductGrid from '../Components/Products/ProductGrid'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'

const CollectionPage = () => {
    const {collection} = useParams() 
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const {products, loading, error} = useSelector((state) => state.products)
    
    const sidebarRef = useRef(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    const queryParams = Object.fromEntries([...searchParams])

    useEffect(()=>{
      dispatch(fetchProductsByFilters({ collection, ...queryParams}))
    },[dispatch, collection, searchParams])

    const toggleSIdebar = () =>{
        setSidebarOpen(!sidebarOpen)

    }

    const handleClickOutside = (e) =>{
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setSidebarOpen(false);
        }
    }

    useEffect(()=>{
        // Add event listener to close the sidebar when clicking outside of it
        document.addEventListener('mousedown', handleClickOutside)
        
        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


   

  return (
    <div className='flex flex-col lg:flex-row'>
        {/* Mobile Filter button */}
        <button onClick={toggleSIdebar} className='lg:hidden border p-2 flex justify-center items-center'>
            <FaFilter className='mr-2 ' /> Filters

        </button>

        {/* Filter sideBar */}
        <div ref={sidebarRef} className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 `}>  
            <FilterSidebar />
        </div>
        <div className=" flex-grow p-4">
            <h2 className=" text-2xl uppercase mb-4 ">All Collection</h2>

            {/*  Sort options */}
            <Sortoptions />

            {/* Product Grid */}
            <ProductGrid product={products} loading={loading} error={error} />
        </div>
    </div>
  )
}

export default CollectionPage