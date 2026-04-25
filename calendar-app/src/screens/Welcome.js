import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Btn/Button"
import NavBar from "../Components/navb/NavBar"


function Welcome(){
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <NavBar src="images/accalendar.png" className="w-full rounded" />

            <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
                <h1 className="text-[60px] text-red-500 font-bold border border-yellow-400 rounded-lg">
                    Increase Your Productivity
                </h1>

                <Button onClick={() => navigate("/calendar")}>
                    Enter
                </Button>
            </div>
        </div>
    );
}



export default Welcome;