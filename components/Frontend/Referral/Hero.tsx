"use client"
import Image from 'next/image';
import React from 'react';
import QuestionFlow from './QuestionFlow';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="max-h-screen max-w-screen">
      <section className="">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-12">
          <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            <div>
              <div className="text-center lg:text-left">
                <Link href="https://www.bioenneagram.com/" className="block">
                  <div className='flex flex-col md:flex-row justify-center items-center '>
                    <Image src={'https://ucarecdn.com/d673768b-7377-4048-be00-2eff379b5c2c/-/scale_crop/300x300/-/rasterize/'} alt="logo" width={100} height={100} />
                    <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj mb-4">BioEnneagram</h1>
                    {/* <p className="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula massa in enim luctus. Rutrum arcu.</p> */}
                  </div>
                </Link>
                <QuestionFlow />
              </div>

              <div className="flex items-center justify-center mt-10 space-x-6 sm:space-x-8">
                <div className="flex items-center">
                  <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">8</p>
                  <p className="ml-3 text-sm text-gray-900 font-pj">Empresas<br />Atendidas</p>
                </div>

                <div className="hidden sm:block">
                  <svg className="text-gray-400" width="16" height="39" viewBox="0 0 16 39" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                    <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                    <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.584"></line>
                    <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.584"></line>
                    <line x1="0.72265" y1="38.584" x2="15.7226" y2="28.584"></line>
                  </svg>
                </div>

                <div className="flex items-center">
                  <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">+620</p>
                  <p className="ml-3 text-sm text-gray-900 font-pj">Consultas<br />Pacientes</p>
                </div>
              </div>
            </div>

            <div className='hidden lg:flex justify-center items-center h-screen'>
              <Image className="h-auto" width={800} height={800} src="/eneagrama-game-1x1.avif" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>

  )
}


export default Hero;