import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const test = () => {
            navigate("/auth/login")
        }
    
        test()
    })
    
    return (
        <div>
            Loading.............
        </div>
    )
}

export default Index