import Image from 'next/image';
import React from 'react'

const Works = () => {
  return (
    <div className='p-6 w-full mt-32 md:mt-16 '>
        <div className='md:flex md:flex-col '>
            <h1 className='text-2xl lg:text-4xl font-medium tracking-tight'>
                How it <span className='font-bold text-red-500'>works</span> ?
            </h1>
            <div className="w-full mt-12 flex flex-col items-center gap-20 md:flex-row md:items-start md:justify-center lg:gap-40">
                {/* Section 1 */}
                <div className="flex flex-col items-start w-[300px] lg:w-[400px]">
                    <div>
                        <Image 
                        src="/images/phone.png"
                        alt="phone"
                        width={400}
                        height={400}
                        className="rounded-xl md:h-[243px] lg:h-[400px]"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl mt-4"><span className='font-bold'>Schedule</span> a free pickup</h1>
                        <p className="mt-2 text-md">
                        Get doorstep pickup for parcels from your location. Book couriers for yourself or your loved ones online from our website or app.
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="flex flex-col items-start w-[300px] justify-start lg:w-[400px]">
                    <div>
                        <Image 
                        src="/images/picking.png"
                        alt="picking"
                        width={400}
                        height={400}
                        className="rounded-x md:h-[243px] lg:h-[400px]"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl mt-4">We arrive at your <span className='font-bold'>doorstep</span></h1>
                        <p className="mt-2">
                        Our partners reach your location within 24 hours of placing the order.
                        </p>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="flex flex-col items-start w-[300px] lg:w-[400px]">
                    <div>
                        <Image 
                        src="/images/truck.png"
                        alt="truck"
                        width={400}
                        height={400}
                        className="rounded-xl md:h-[243px] lg:h-[400px]"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl mt-4">Sit back and <span className='font-bold'>relax</span></h1>
                        <p className="mt-2">
                        Your order will be delivered to the chosen destination. Track it from our website or app.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div> 
  )
}

export default Works;