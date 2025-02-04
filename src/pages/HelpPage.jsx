import React from 'react';

function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Help</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-8">
          <h2 className="text-xl font-bold mb-2">FAQs</h2>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">What is this app about?</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">How do I use this app?</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">What are the benefits of using this app?</a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-8">
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <p className="mb-2">If you have any questions or need help, please don't hesitate to contact us.</p>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">Email: support@example.com</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">Phone: 123-456-7890</a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-8">
          <h2 className="text-xl font-bold mb-2">Resources</h2>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">User Guide</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">FAQs</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">Blog</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default HelpPage;