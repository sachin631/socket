'use client'
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios_client from "../lib/client-lib";
import { useMutation } from "@tanstack/react-query";

const Register = () => {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn:async(data)=>{
      console.log("/asdasdasdasd+++++++++++++++++")
      const res = await axios_client.post('/user/register', data);
      console.log(res,"asasd=>>>>>>>>>>>>>>>>>")
      return res;
    },
    onSuccess: () => {
      toast.success("Form submitted successfully");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
    onError: (error) => {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  });

  const submit_button = (data) => {
    mutation.mutate(data);
  };

  return (
    <section className="dark:bg-gray-900 flex justify-center items-center h-[100vh]">
      <div className="flex flex-col justify-center items-center gap-4 shadow-black shadow-2xl px-6 py-6 scale-105">
        <div>Register Section</div>
        <form onSubmit={handleSubmit(submit_button)} className="w-full flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              {...register("first_name", { required: "First name is required" })}
              className="input-class"
            />
            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              {...register('last_name', { required: "Last name is required" })}
              className="input-class"
            />
            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="input-class"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="input-class"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
            Submit
          </Button>
        </form>
        <p className="text-blue-500 text-center">
          <Link href="/login">Login if you already have an account</Link>
        </p>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Register;
