import React from "react";
import Button from "../Components/Btn/Button";
import { useNavigate } from "react-router-dom";


/*
First: I want to do a page routing using the login button in welcome.js. (DONE)
Second: When the button is clicked it in Welcome.js it will go to Login.js (DONE), so the user can fill out a login form (DONE)
Third: Since App.js is the application and where everything happens I will have to also do the routing in there too (DONE)
Four: I will need to also do a check whether the user is logged in or not with user authentication (TODO)
if the user is not logged in: Then when they press the enter button it will prompt them to log in first before redirecting them to the calendar UI
if the user is logged in then that will be recorded in the database, and they can just press enter and go to the calendar

*/


function Login(){

    const navigate = useNavigate();

    // const handleLogin = () => {
    //     fakeAuth.login(() => {
    //         navigate("/");
    //     });
    // }
    return(
        <div className="flex h-screen flex-col justify-center box-border rounded-md border-8 border-yellow-600 px-6 py-12 lg:px-8 bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="images/accalendar.png" alt="App Login" className="mx-auto h-32 w-auto" />
                <h1 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
                    Login with Canvas Account
                </h1>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form 
                    className="space-y-6" 
                    onSubmit={(e) => {
                        e.preventDefault();
                        // handleLogin();
                    }}
                    
                    >
                    <div>
                        <label 
                            htmlFor="email"
                            className="block text-sm/6 font-medium text-gray-100"
                        >
                        Ursinus Email
                        </label>
                        <div className="mt-2">
                            <input 
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="current-email"
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm/6 font-medium text-gray-100"
                            >
                                Password
                            </label>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-red-400 hover:text-indigo-300"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            LogIn 
                        </Button>
                    </div>
                </form>



            </div>

        </div>

    );
}


export default Login;