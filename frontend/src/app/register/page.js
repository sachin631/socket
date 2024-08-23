'use client'
import axios_client from "@/lib/client-lib";
import { Alert, Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Register = () => {
  const router =useRouter()
  const [formData,setformData]=useState({
    first_name:'',
    last_name:'',
    email:'',
    password:''
  });

  let on_change=(event)=>{

    let {name,value}=event.target;
    setformData({
      ...formData,
      [name]:value
    })

  }

  let submit_button = async (event) => {
    event.preventDefault();
    try {
      const res = await axios_client.post('/user/register',formData);
      if(res.status==200){
        toast.success(res.data.message) ;
      
      }
      console.log('hello', res); // This will now print
      setTimeout(()=>{
        router.push("/login")
      },1000)
      
    } catch (error) {
      console.error('Error:', error); // This will log the error details
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Show the error message in a toast
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  

  return (
    <div>
      <section class=" dark:bg-gray-900 flex justify-center items-center  h-[100vh]">
        <div className="flex flex-col justify-center items-center gap-4 shadow-black shadow-2xl px-6 py-6  scale-105">
          <div>Register Section</div>
          <div>
            <input type="text" name="first_name" placeholder="first_name" onChange={on_change}/>
          </div>
          <div>
            <input type="text" name="last_name" placeholder="last_name" onChange={on_change}/>
          </div>
          <div>
            <input type="email" name='email' placeholder="email" onChange={on_change}/>
          </div>
          <div>
            <input type="password" name='password' placeholder="password" onChange={on_change}/>
          </div>
          <Button type="primary" onClick={submit_button}>
            Submit
          </Button>
          <p className="text-blue-500 text-center">
            <Link href="/login">login if already have an account</Link>
          </p>
        </div>
        <ToastContainer />
      </section>
    </div>
  );
};

export default Register;
