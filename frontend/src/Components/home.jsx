import React, { useState } from 'react';
import { IoCameraOutline, IoFastFood } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";
import Loader from './Loader';
import Gemini from './Gemini';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '../../constants';

const Home = () => {
    const [dishName, setDishName] = useState("");
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    };

    // ✅ Handle manual text input recipe generation
    const handleTextSubmit = async () => {
        if (!dishName) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a recipe name",
            });
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);
        setDishName("");

        try {
            const res = await axios.post(`${BACKEND_URL}/api/generate`, { dishName }, config);
            console.log("Response:", res.data);
            setResponse(res.data);
        } catch (error) {
            console.error("Error in Axios request:", error.response || error);
            const message = error.response?.data?.error || "Something went wrong!";
            setError(message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: message,
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle image upload
    const handleFileSubmit = async () => {
        if (!selectedFile) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please upload an image",
            });
            return;
        }

        setLoading(true);
        setError(null);
        // setSelectedFile(null);

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            // Backend returns plain text (dish name)
            const res = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Dish name from backend:", res.data);

            setDishName(res.data); // plain text
            setShowModal(true);    // show modal
        } catch (error) {
            console.error("Error in Axios request:", error.response || error);
            const message = error.response?.data?.error || "Something went wrong!";
            setError(message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: message,
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch recipe after dish is identified
    const handleGetRecipe = async () => {
        setLoading(true);
        setShowModal(false);
        setResponse(null);
        setDishName("");

        try {
            const res = await axios.post(`${BACKEND_URL}/api/generate`, { dishName }, config);
            console.log("Recipe response:", res.data);
            setResponse(res.data);
        } catch (error) {
            console.error("Error generating recipe:", error.response || error);
            const message = error.response?.data?.error || "Something went wrong!";
            setError(message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="home" className="w-full">
            {/* Header Section */}
            <div className="pt-8 pb-12 px-5">
                <div className="flex justify-center items-center gap-16 text-9xl mb-4">
                    <IoCameraOutline className="animate-sequence1 transition-all duration-500" />
                    <FaLongArrowAltRight className="animate-sequence2 transition-all duration-500" />
                    <IoFastFood className="animate-sequence3 transition-all duration-500" />
                </div>
                <p className="text-center font-normal text-2xl md:text-3xl lg:text-4xl">
                    TRANSFORM YOUR PHOTOS INTO CUISINES
                </p>
            </div>

            {/* Upload Section */}
            <div className="bg-bg flex flex-col gap-8 py-8 px-4">
                <p className="text-center font-bold lg:text-5xl md:text-4xl sm:text-2xl text-xl">
                    Meet Your Personal AI-Powered Kitchen Assistant
                </p>

                <div className="bg-white flex justify-center lg:w-2/4 md:w-2/3 sm:w-2/3 w-full mx-auto rounded-2xl flex-col items-center gap-6 p-10 mb-6">
                    {error && (
                        <div className="text-red-500 text-center font-semibold my-4">
                            {error}
                        </div>
                    )}

                    {/* Manual Text Input */}
                    <input
                        className="text-zinc-600 font-mono ring-1 md:h-16 h-12 text-xl ring-zinc-400 focus:ring-2 w-full focus:ring-orange outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-orange"
                        placeholder="Enter recipe name..."
                        onChange={(e) => setDishName(e.target.value)}
                        value={dishName}
                        type="text"
                    />

                    <button
                        onClick={handleTextSubmit}
                        disabled={loading}
                        className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-2xl before:bg-orange hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Give Recipe
                    </button>

                    <div className="w-full my-5 relative">
                        <hr className="w-full" />
                        <p className="bg-white px-2 absolute -top-3 left-1/2 transform -translate-x-1/2">OR</p>
                    </div>

                    {/* Image Upload */}
                    <input
                        id="picture"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="flex h-10 w-full hover:cursor-pointer rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                    />

                    <button
                        onClick={handleFileSubmit}
                        disabled={loading}
                        className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-2xl before:bg-orange hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Upload Image
                    </button>
                </div>
            </div>

            {/* Loading or Response Display */}
            {loading ? (
                <Loader />
            ) : response ? (
                <Gemini content={response} />
            ) : null}

            {/* ✅ Dish Name Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[90%] sm:w-[400px]">
                        <h2 className="text-2xl font-bold mb-4 text-orange-600">Dish Identified!</h2>
                        <p className="text-xl font-semibold mb-6">{dishName}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleGetRecipe}
                                className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 transition"
                            >
                                Get Recipe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
