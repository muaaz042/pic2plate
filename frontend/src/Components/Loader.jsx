import React from 'react'

const Loader = () => {
    return (
        <div class="text-center my-8">
            <div
                class="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange mx-auto"
            ></div>
            <h2 class="text-black mt-4">Please wait .....</h2>
        </div>
    )
}

export default Loader