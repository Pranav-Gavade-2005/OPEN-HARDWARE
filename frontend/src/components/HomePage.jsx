import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Navbar from './Navbar';

const HomePage = () => {
    return (
        <>
            <Navbar/>
            {/* Hero Section */}
            <section className="relative bg-white overflow-hidden min-h-screen flex items-center pt-16">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block">Welcome to</span>
                                    <span className="block">OpenHardware</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Empowering innovation through open-source hardware solutions. Join our community of makers, developers, and enthusiasts.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link
                                            to={'/login'}
                                            // to={isAuthenticated ? "/profile" : "/login"}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
                                        >
                                            {/* {isAuthenticated ? "Go to Profile" : "Get Started"} */}
                                            Get Started!
                                            <ChevronRight className="ml-2" size={20} />
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a href="#learn-more" className="w-full flex items-center justify-center px-8 py-3 border border-gray-900 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="min-h-screen bg-gray-50 flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="lg:text-center">
                        <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to get started
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Discover our comprehensive suite of tools and resources designed to help you succeed in your hardware projects.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {/* Feature 1 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Fast Development</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Rapid prototyping and development tools to bring your ideas to life quickly.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Customizable</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Fully customizable components to match your specific needs and requirements.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Community Driven</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Join a thriving community of developers and makers sharing knowledge and resources.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="min-h-screen bg-white flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="lg:text-center">
                        <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">About Us</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Our Mission
                        </p>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Who We Are</h3>
                                <p className="text-gray-600">
                                    OpenHardware is a community-driven platform dedicated to making hardware development accessible to everyone.
                                    We believe in the power of open-source collaboration and the potential of shared knowledge to drive innovation.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                <p className="text-gray-600">
                                    We envision a world where hardware development is as accessible as software development,
                                    where anyone with an idea can bring it to life through our platform and community support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen bg-gray-50 flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="lg:text-center">
                        <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Featured Projects</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Community Showcase
                        </p>
                    </div>
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Project 1 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                <img className="w-full h-48 bg-gray-300" src={"./home/smartHome.jpg"}></img>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900">Smart Home Controller</h3>
                                <p className="mt-2 text-gray-600">An open-source home automation system built with our platform.</p>
                            </div>
                        </div>
                        {/* Project 2 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                <img className="w-full h-48 bg-gray-300" src={'./home/environmentMonitor.jpg'}></img>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900">Environmental Monitor</h3>
                                <p className="mt-2 text-gray-600">Track and analyze environmental data with this community project.</p>
                            </div>
                        </div>
                        {/* Project 3 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                <img className="w-full h-48 bg-gray-300" src={'./home/roboticsPlatform.jpg'}></img>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900">Robotics Platform</h3>
                                <p className="mt-2 text-gray-600">A modular robotics platform for educational and research purposes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="community" className="min-h-screen bg-white flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="lg:text-center">
                        <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Community</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Join Our Growing Community
                        </p>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Community Benefits</h3>
                                <ul className="space-y-4 text-gray-600">
                                    <li>• Access to exclusive resources and documentation</li>
                                    <li>• Regular community meetups and workshops</li>
                                    <li>• Mentorship opportunities</li>
                                    <li>• Project collaboration possibilities</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Get Involved</h3>
                                <p className="text-gray-600 mb-4">
                                    Whether you're a beginner or an experienced developer, there's a place for you in our community.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-6 py-3 border border-gray-900 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
                                >
                                    Join Now
                                    <ChevronRight className="ml-2" size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="min-h-screen bg-gray-50 flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="lg:text-center">
                        <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Contact</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Get in Touch
                        </p>
                    </div>
                    <div className="mt-10 max-w-xl mx-auto">
                        <form className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="4"
                                    className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                ></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage