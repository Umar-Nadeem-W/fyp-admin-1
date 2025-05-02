'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '@/app/components/navbar';

const ResultPage = ({ searchParams}) => {
  const session_id = searchParams.session_id;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      const fetchSession = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/admin/checkout', {session_id});
          setSession(response.data);
        } catch (error) {
          console.error('Error fetching session:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSession();
    }
  }, [session_id]);

  return (
    <>
      <div id="navbar">
        <NavBar />
      </div>
      <div className="px-[5%] min-w-[100%] bg-[#5E5E5E]">
{loading?(
  <>
    <div
          className="bg-[#5E5E5E] flex flex-col text-white justify-center items-center"
          style={{ minHeight: `calc(100vh - ${140}px)` }}>
         <div className="flex justify-center items-center flex-col text-2xl space-y-3 font-bold">
         <p>Loading...</p>
          <p>Please Wait...</p>
        </div>
      </div>
</>
):(
<>
<div>
      {session.payment_status === 'paid' ? (
         <div
         className="bg-[#5E5E5E] flex flex-col text-white justify-center items-center"
         style={{ minHeight: `calc(100vh - ${140}px)` }}>
         <div className="flex justify-center items-center flex-col text-lg md:text-2xl space-y-3 font-bold p-[10px] break-all">
         <p>Payment Successful!</p>
         <p>Payment ID: {session.id}</p>
           <p>You will Be Contacted via E-Mail Soon</p>
          <p>Amount: ${(session.amount_total / 100).toFixed(2)} {session.currency.toUpperCase()}</p>
         </div>
       </div>

      ) : (
          <div
          className="bg-[#5E5E5E] flex flex-col text-white justify-center items-center"
          style={{ minHeight: `calc(100vh - ${140}px)` }}>
         <div className="flex justify-center items-center flex-col text-2xl space-y-3 font-bold">
         <p>Payment failed or was canceled.</p>
          <p>Please try again.</p>
        </div>
      </div>
      )}
    </div>
</>
)} </div>
    </>
  );
};

export default ResultPage;