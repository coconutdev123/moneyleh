import {Card, CardContent, CardHeader} from "../../../../../../packages/shared/src/components/ui/card";
import {useState} from 'react';
import {useConvexAuth} from "convex/react";
import {useAuthA} from "";
import {Input} from "../../../../../../packages/shared/src/components/ui/input";
import {Label} from "../../../../../../packages/shared/src/components/ui/label";
import {useNavigate} from "react-router-dom";



export default function SignIn (){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { signIn } = useAuth();

    
    return (

    );
}

