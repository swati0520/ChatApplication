import React from 'react';

function MorePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-200">
      <h1 className="text-2xl font-bold mb-4">More</h1>
      <ul className="list-none">
        <li className="mb-2">
          <a href="#" className="text-black hover:text-blue-950 font-bold ">
            Help/Support
          </a>
        </li>
        <li className="mb-2 mt-2">
          <a href="#" className="text-black hover:text-blue-950 font-bold ">
            Terms and Conditions
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-black hover:text-blue-950 font-bold ">
            Privacy Policy
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-black hover:text-blue-950 font-bold ">
            About Us
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-black hover:text-blue-950 font-bold ">
            Feedback
          </a>
        </li>
      </ul>
    </div>
  );
}

export default MorePage;

