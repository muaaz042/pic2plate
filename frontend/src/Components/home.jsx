import React from 'react';
import { IoCameraOutline, IoFastFood } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";

const Home = () => {
    return (
        <div id='home' className="w-full">
            <div className="pt-8 pb-12">
                <div className="flex justify-center items-center gap-16 text-9xl mb-4">
                    <IoCameraOutline className="animate-sequence1 transition-all duration-500" />
                    <FaLongArrowAltRight className="animate-sequence2 transition-all duration-500" />
                    <IoFastFood className="animate-sequence3 transition-all duration-500" />
                </div>
                <p className="text-center font-normal text-4xl">TRANSFORM YOUR PHOTOS INTO CUISINES</p>
            </div>
        </div>
    );
};

export default Home;
