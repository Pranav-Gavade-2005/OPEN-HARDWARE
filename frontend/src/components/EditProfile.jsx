import React, { useEffect, useState, useRef } from 'react'
import { Edit2 } from 'lucide-react';
import Navbar from './Navbar'
import { getCurrentUser, userApi } from '../services/api'
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const EditProfile = () => {

    const [user, setUser] = useState([]);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(user.profilePicture);
    const fileInputRef = useRef(null);
    const [passData, setPassData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(user.profilePicture);
        };
        reader.readAsDataURL(file);

        // Upload image to backend
        try {
            const profilePicPath = await userApi.updateUserProfilePicture(file);
            setPreviewImage(profilePicPath)
            toast.success('Profile Picture Updated Successfully!');
            
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            // Revert to previous image on error
            setPreviewImage(user.profilePicture);
            toast.error('Failed to upload image. Please try again.');
        }
    };

    const fetchUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            setPreviewImage(userData.profilePicture);
        } catch (err) {
            console.log("Error while fetching user data: " + err)
        }
    }

    useEffect(() => {
        fetchUser();
    }, [navigate])


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const result = await userApi.updateUserProfile(user)
        toast.success("Profile details get updated successfully!");
        console.log(result);
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passData.password === passData.confirmPassword)
        {
            const result = await userApi.updatePassword(user._id, passData.password);
            //console.log(result);
            toast.success("Password updated successfully!");
        }   
        else
            toast.error("Password don't match, please try again...!");
    }

    return (
        <>
            <div className="min-h-screen mt-16 flex justify-center">
                <Toaster richColors/>
                <div className="p-2 mb-6 sm:w-[40vw]">
                    <div className="flex flex-col gap-10 w-[100%]">
                        <div className="mt-16">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img
                                        src={previewImage || '/default-avatar.png'}
                                        alt={user.name}
                                        className="h-50 w-50 rounded-full object-cover"
                                    />
                                    <button
                                        className="absolute bottom-0 right-5 bg-white rounded-full p-1 shadow-sm"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Edit2 className="h-7 w-7 text-gray-600" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            <form className='mt-14' onSubmit={handleUpdateProfile}>
                                <div className="pb-7">
                                    <label className="mt-10 text-2xl  text-gray-900">Name: </label><br />
                                    <input type="text" className="text-xl font-bold text-gray-900 px-3 py-2 border-2 rounded-xl w-full" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                </div>

                                <div className="pb-7">
                                    <label className="mt-10 text-2xl  text-gray-900">Username: </label><br />
                                    <input type='text' className="text-xl text-gray-900 px-3 py-2 border-2 rounded-xl w-full bg-gray-300" value={user.username} disabled />
                                </div>

                                <div className="pb-7">
                                    <label className="mt-10 text-2xl  text-gray-900">Occupation: </label><br />
                                    <select
                                        className="text-xl text-gray-900 px-3 py-2 border-2 rounded-xl w-full cursor-pointer"
                                        value={user.occupation}  // controlled component
                                        onChange={(e) => setUser({ ...user, occupation: e.target.value })}
                                    >
                                        {/* <option value="">Select occupation</option> */}
                                        <option value="Teacher">Teacher</option>
                                        <option value="Engineer">Engineer</option>
                                        <option value="Designer">Designer</option>
                                        <option value="Student">Student</option>
                                    </select>
                                </div>

                                <div className="pb-7">
                                    <label className="mt-10 text-2xl  text-gray-900">Email: </label><br />
                                    <input type='text' className="text-xl text-gray-900 bg-gray-300 px-3 py-2 border-2 rounded-xl w-full" value={user.email} disabled />
                                </div>
                                <button type="submit" className='bg-black text-xl text-white font-bold p-3 w-full rounded-xl hover:bg-gray-800 cursor-pointer'>UPDATE PROFILE</button>
                            </form>
                        </div>

                        <div className="">
                            <form action="" onSubmit={handlePasswordUpdate}>
                                <div className="">
                                    <label className="mt-10 text-2xl  text-gray-900">Reset your password: </label><br />
                                    <input type="password" className="my-5 text-xl font-bold text-gray-900 px-3 py-2 border-2 rounded-xl w-full" name='password' placeholder='Enter new password' onChange={(e) => setPassData({ ...passData, password: e.target.value })} />
                                    <input type="password" className="mb-5 text-xl font-bold text-gray-900 px-3 py-2 border-2 rounded-xl w-full" name='cpassword' placeholder='Re-Enter new password' onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })} />
                                </div>

                                <button type="submit" className='bg-green-700 text-xl text-white font-bold p-3 w-full rounded-xl hover:bg-green-800 cursor-pointer' onClick={() => { setFlag(!flag) }}>Reset Password</button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile