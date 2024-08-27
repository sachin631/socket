'use client';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import axios_client from './lib/client-lib';
import useSocket from './lib/socket';

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [receiverId, setReceiverId] = useState('');

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users_list'],
    queryFn: async () => {
      const res = await axios_client.get('/user/user_list');
      return res.data;
    },
  });

  const { data: userInfoData, isLoading: isUserInfoLoading } = useQuery({
    queryKey: ['user_info'],
    queryFn: async () => {
      const res = await axios_client.get('/user/details');
      return res.data;
    },
  });

  const { socket, sendMessage } = useSocket(userInfoData?.data?._id);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (receivedMessage) => {
        console.log('Received message:', receivedMessage);
        setChatHistory((prev) => [...prev, receivedMessage]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (receiverId) {
        try {
          const res = await axios_client.get(`/chat/history/${receiverId}`);
          setChatHistory(res.data);
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        }
      }
    };

    fetchChatHistory();
  }, [receiverId]);

  const handleSendMessage = () => {
    const messageData = {
      sender_id: userInfoData?.data?._id,
      receiver_id: receiverId,
      message,
    };

    sendMessage(messageData);
    setMessage(''); // Clear the input after sending the message
  };

  if (isUsersLoading || isUserInfoLoading) {
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
                    {usersData?.data.map((user) => (
                      <li
                        key={user._id}
                        className="py-4 cursor-pointer rounded-md bg-black text-white hover:bg-[brown] mt-2"
                        onClick={() => {
                          setEmail(user.email);
                          setReceiverId(user._id);
                        }}
                      >
                        {user.email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-solid border-black border px-10 w-[60vw]">
              <div>
                <div className="text-left text-4xl py-4">{email}</div>
                <div className="h-[60vh] border border-blue-400 overflow-auto">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className="message">
                      <strong>{msg.sender_id?.email}: </strong>
                      {msg.message}
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                  />
                  <Button type="primary" className="px-4 ml-4" onClick={handleSendMessage}>
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
