import React from "react";
import app_store from "../../assets/common/images/app-store.png";
import play_store from "../../assets/common/images/play-store.png";
import insta from "../../assets/common/icons/instagram.svg";
import facebook from "../../assets/common/icons/facebook.svg";
import youtube from "../../assets/common/icons/youtube.svg";
import twit from "../../assets/common/icons/twitter.svg";

const Footer = () => {
  return (
    <footer className="bg-[#36334D] text-white">
      <div className="max-w-[1440px] mx-auto pt-[40px] flex flex-col md:flex-row gap-8">
        {/* Column 1: My Prop AI (50%) */}
        <div className="md:w-1/2 ">
          <h5 className="text-xl font-bold mb-4">My Prop AI</h5>
          <p className="text-sm leading-7 w-[500px]">
            My Prop AI is the India's No.1 Real estate marketplace with years of experience and a deep understanding of the local real estate market, we have built a reputation for providing exceptional service, personalized attention, and expert guidance to our clients.
          </p>
          <div className="mt-6">
            <h5 className="text-xl font-bold mb-2">Contact</h5>
            <p className="text-sm">Call us on: <span className="font-medium">+91 98846 26627</span></p>
            <p className="text-sm">Write to us at: <span className="font-medium">contact@teanso.com</span></p>
          </div>
        </div>

        {/* Columns 2 & 3: Share 50% */}
        <div className="md:w-1/2 flex flex-col md:flex-row gap-8">
          {/* Column 2: Company */}
          <div className="flex-1">
            <h5 className="text-xl font-bold mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Career with Us</a></li>
              <li><a href="#" className="hover:underline">Our Articles</a></li>
              <li><a href="#" className="hover:underline">Feedback</a></li>
              <li><a href="#" className="hover:underline">Report a Problem</a></li>
              <li><a href="#" className="hover:underline">Customer Service</a></li>
              <li><a href="#" className="hover:underline">Download Mobile App</a></li>
            </ul>
            <div className="flex gap-2 mt-4">
              <img src={play_store} alt="Playstore" className="h-10" />
              <img src={app_store} alt="Appstore" className="h-10" />
            </div>
          </div>

          {/* Column 3: For Sellers & Social */}
          <div className="flex-1">
            <h5 className="text-xl font-bold mb-4">For Sellers</h5>
            <a href="#" className="text-sm hover:underline">Post Property Free</a>
            <h5 className="text-xl font-bold mb-4 mt-6">Keep in touch</h5>
            <div className="flex gap-4">
              <a href="#"><img src={facebook} alt="Facebook" className="h-6 w-6" /></a>
              <a href="#"><img src={twit} alt="Twitter" className="h-6 w-6" /></a>
              <a href="#"><img src={insta} alt="Instagram" className="h-6 w-6" /></a>
              <a href="#"><img src={youtube} alt="YouTube" className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-[#36334D] text-white text-right max-w-[1440px] mx-auto ">
         <p className="">
        © 2023 www.mypropai.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
