"use client"
import { Image as ImageProps } from "@/types"
import { Tab } from "@headlessui/react"
import GalleryTab from "./gallery-tab"
import Image from "next/image"

interface GalleyProps {
    images: ImageProps[]
}

const Gallery: React.FC<GalleyProps> = ({ images }) => {
    return (
        <Tab.Group as="div" className="flex flex-col-reverse">
            <div className=" mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-2xl">
                <Tab.List className="grid grid-cols-4 gap-6">
                    {
                        images.map((image) => (
                            <GalleryTab key={image.url} image={image} />
                        ))
                    }
                </Tab.List>
            </div>
            <Tab.Panels className=" aspect-square w-full">
                {
                    images.map((image) => (
                        <Tab.Panel key={image.url}>
                            <div className=" aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
                                <Image
                                    fill
                                    src={image.url}
                                    alt="photo"
                                    className=" object-cover object-center"
                                />
                            </div>
                        </Tab.Panel>
                    ))
                }
            </Tab.Panels>
        </Tab.Group>
    )
}

export default Gallery