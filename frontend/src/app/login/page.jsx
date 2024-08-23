'use client'
import axios_client from '@/lib/client-lib'
import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const router=useRouter()

const [formData,setFormData]=useState({
  email:'',
  password:''
});

const on_change=(event)=>{
  let {value,name}=event.target
  setFormData({
    ...formData,
    [name]:value
  })
}

const on_submit=async(event)=>{
  try{
    event.preventDefault() ;
    const res=await axios_client.post('/user/login',formData,{withCredentials:true});
    if(res.status==200){
      toast.success(res.data.message);
      setTimeout(()=>{
        router.push("/")
      },1000)
    }
  }catch(error){
    if (error.response && error.response.data) {
      toast.error(error.response.data.message); // Show the error message in a toast
    } else {
      toast.error('An unexpected error occurred');
    }
  }
  

}


  return (
    <div>
      <section class=" dark:bg-gray-900 flex justify-center items-center  h-[100vh]">
        <div className="flex flex-col justify-center items-center gap-4 shadow-black shadow-2xl px-6 py-6  scale-105">
          <div>LOGIN Section</div>
          <div>
            <input type="email" placeholder="email" name="email" onChange={on_change} />
          </div>
          <div>
            <input type="password" placeholder="password" name="password" onChange={on_change}/>
          </div>
          <Button type="primary" onClick={on_submit}>Submit</Button>
          <p className="text-blue-500 text-center">
            <Link href="/register">register if not account</Link>
          </p>
        </div>
        <ToastContainer />
      </section>
    </div>
  )
}

export default Login