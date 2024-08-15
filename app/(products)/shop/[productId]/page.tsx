'use client'
import Container from "@/components/ui/container"
import Gallery from "@/components/gallery/gallery"
import { useGetProduct } from "@/features/products/api/use-get-product"
import Info from "@/components/info"
import { Loader } from "lucide-react"

interface ProductPageProps {
  params: {
    productId: string
  }
}

const ProductPage: React.FC<ProductPageProps> = ({
  params
}) => {
  const productQuery = useGetProduct(params.productId);
  const product = productQuery.data;
  // const suggestedProducts = await getProducts({categoryId: product?.category?.id});


  return (
    <div className=" bg-white">
      <Container>
        {
          product ? (
            <div className=" px-4 py-10 sm:px-6 lg:px-8">
              <div className=" lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                {/* Gallery */}
                <Gallery images={product?.images} />
                <div className=" mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                  <Info data={product} />
                </div>
              </div>
              <hr className="my-10" />
              {/* <ProductList title="Related Items" data={suggestedProducts}/> */}
            </div>
          ) : (
            <div className=' h-[500px] w-full flex items-center justify-center'>
              <Loader className=' size-6 text-slate-300 animate-spin' />
            </div>
          )
        }
      </Container>
    </div>
  )
}

export default ProductPage;