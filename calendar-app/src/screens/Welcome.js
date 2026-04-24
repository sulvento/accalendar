import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Btn/Button"
import NavBar from "../Components/navb/NavBar"




function Welcome(){
    const navigate = useNavigate();

    return (
        <div>
            <NavBar className="m-1 rounded flex w-screen "></NavBar>
            <div className="flex flex-col h-screen items-center justify-center gap-6"> 
                <h1 className="text-[60px] text-red-500 text-bold border border-yellow-400 rounded-lg">Increase Your Productivtity</h1>
                <div>
                    <Button onClick={() => navigate("/calendar")}>Enter</Button>
                </div>
                <div>
                
                </div>
            </div>
        </div>
       
        
    );
    
}



export default Welcome;