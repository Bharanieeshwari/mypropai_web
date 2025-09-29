import React from "react";

const PostPropertyNavbar = () => {
  return (
    <>
      <div className="bg-[linear-gradient(90deg,_#252A93_0.73%,_#624999_99.31%)] h-[70px] ">
        <nav className=" py-[15px] max-w-1440px ml-[70px] flex justify-between items-center">
          <div>
            <img src="/logo.png" alt="Logo" className="h-10" />
          </div>
          <div className="flex gap-6 list-none text-white text-lg mr-10 font-medium">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Buyer</a>
            </li>
            <li>
              <a href="#">Seller</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </div>
        </nav>
      </div>
    </>
  );
};

export default PostPropertyNavbar;
