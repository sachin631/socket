'use client'
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import axios_client from './lib/client-lib';
import useSocket from './lib/socket'; // Updated import

export default function Home() {
  const [email, setEmail] = useState();

  const { data, isLoading } = useQuery({
    queryKey: ['users_list'],
    queryFn: async () => {
      const res = await axios_client.get('/user/user_list');
      return res.data;
    },
  });

  const { data: user_info_data, isLoading: user_info_isLoading, isSuccess: user_info_isSuccess } = useQuery({
    queryKey: ['user_info'],
    queryFn: async () => {
      const res = await axios_client.get('/user/details');
      return res.data;
    },
  });

  const socket = useSocket(user_info_data?.data?._id);

  if (isLoading || user_info_isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <main className="font-[poppins]">
        <section>
          <div className="main_div flex md:flex-row flex-col justify-start gap-6 items-center text-center w-[100%] px-11 border border-black border-solid overflow-auto">
            <div className="border-solid rounded-md border-black border px-10 w-[40vw] py-6 overflow-auto h-[90vh]">
              <div className="w-full">
                <h1 className="text-center text-bold text-4xl">All Users</h1>
                <br />
                <hr className="border-t-2 border-blue-500" />
                <br />

                <div>
                  <ul>
                    {data?.data.map((curelem) => (
                      <li
                        key={curelem.email}
                        className="py-4 cursor-pointer rounded-md bg-black text-white hover:bg-[brown] mt-2"
                        onClick={() => setEmail(curelem.email)}
                      >
                        {curelem.email}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h1 className="text-center text-bold text-4xl mt-6">Channels</h1>
                  <br />
                  <hr className="border-t-2 border-blue-500" />
                  <br />

                  <div>
                    <ul>
                      {/* Example channel list */}
                      {[...Array(9)].map((_, index) => (
                        <li
                          key={index}
                          className="py-4 cursor-pointer bg-black text-white hover:bg-[brown] mt-4"
                        >
                          User {index + 1}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-solid border-black border px-10 w-[60vw]">
              <div>
                <div className="text-left text-4xl py-4">{email}</div>
                <div className="h-[60vh] border border-blue-400">Chat container</div>
                <div>
                  <input type="text" placeholder="Enter message" />
                  <Button type="primary" className="px-4 ml-4">
                    SEND
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
