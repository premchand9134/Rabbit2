
import { Link } from 'react-router-dom'

const ProductGrid = ({product , loading, error}) => {
  
  
  
  if(loading){
    return <p>Loading.....</p>
  }

  if(error){
    return <p>Error: {error}</p>
  }
  
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 '>
       {
        product?.map((product,index) => (  
          
          <Link key={index} to={`/product/${product._id}`}  className=' block'>
            <div className="bg-white p-4 rounded-lg">
                <div className="w-full h-96 mb-4">
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <h3 className=" text-sm mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm font-medium tracking-tighter">${product.price}</p>
            </div>
          </Link>
        ))
       } 

    </div>
  )
}

export default ProductGrid