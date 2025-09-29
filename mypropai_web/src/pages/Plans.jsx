// src/pages/Plans.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../components/common/PageHeader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DialogBox from "@/components/common/DialogBox";

// Assets
import banner from "../assets/plans/images/plans-banner.png";
import tick from "../assets/plans/icons/tick.svg";
import close from "../assets/plans/icons/close.svg";
import plus from "../assets/plans/icons/plus.svg";
import minus from "../assets/plans/icons/minus.svg";
import ListHomeIcon from "../assets/postproperty/home-icon-mpai.svg";
import arrow_left from "../assets/home/icons/arrow-left.svg";
import arrow_right from "../assets/home/icons/arrow-right.svg";
import payment_successful from '../assets/plans/icons/payment-success-icon.svg'
import ribbon_icon from '../assets/plans/icons/ribbon-style-icon.svg'


// api

import { capitalizeFirstLetter, filterTextOnly, getLoginUserData, isValidMobile, } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { createOrder, getPlansByUser, planPaymentComplete, upgradeSubscription, getUserSubscription } from "@/lib/plans";
import { PlaySquare } from "lucide-react";


// ===================
// Validation Schema
// ===================

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone number is required"),
  comments: Yup.string(),
});

// ===================
// Component
// ===================
function Plans() {
  const navigate = useNavigate();

  // states
  const [userData, setUserData] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [plans, setPlans] = useState([]);
  const [subcriptionData, setSubscriptionData] = useState([]);
  const [showMore, setShowMore] = useState({});

  const [openIndex, setOpenIndex] = useState(null);
  const userId = userData.id;
  const user_name = userData.first_name + userData.last_name;
  const user_email = userData.email;
  const user_phone = userData.phone;

  // formik 
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      comments: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setShowSuccess(true);
      resetForm();
      setTimeout(() => setShowSuccess(false), 3000);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });


  useEffect(() => {
    const user_details = getLoginUserData();
    const user_data = user_details.user
    setUserData(user_data);
    formik.setValues({
      ...formik.values,
      first_name: user_data.first_name || "",
      last_name: user_data.last_name || "",
      phone: user_data.phone || "",
    })
  }, []);

  useEffect(() => {
    function loginUserDatas() {
      if (!userData) return;

    } loginUserDatas()
  })

  const fetchData = async () => {
    if (!userId) return;
    try {
      const [subscriptionRes, plansRes] = await Promise.all([
        getUserSubscription(userId),
        getPlansByUser(userId),
      ]);

      if (subscriptionRes?.success) setSubscriptionData(subscriptionRes.subscription);
      if (plansRes?.success) setPlans(plansRes.plans);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handlePayment = async (plan_id, user_id, plan_price) => {
    const order = await createOrder(plan_price);
    if (!order.success) return;

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "My Prop AI",
      description: "Plan Subscription",
      order_id: order.order_id,
      handler: async function (response) {
        try {
          const paid = await planPaymentComplete({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });

          if (!paid.success) return;

          const plan_verification = await upgradeSubscription({
            user_id,
            plan_id,
          });

          if (plan_verification.success) {

            setIsActivated(true);
            await fetchData();
          }
        } catch (error) {
          console.error("Payment completion error", error);
        }
      },
      prefill: {
        name: user_name,
        email: user_email,
        contact: user_phone,
      },
      notes: {
        address: "India, Asia",
      },
      theme: {
        color: "#8A38F5",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };



  // Plans Deatils
  const buyerResponseText = {
    1: { text: "Upto 5X increase in buyer responses", description: "Wanna try before you buy? this is the plan for you", verify: "Free Verification", available: false },
    2: { text: "Upto 5X increase in buyer responses", description: "Ideal plan for sellers who want quick traction and higher visibility", verify: "Free Verification*", available: true },
    3: { text: "Upto 15X increase in buyer responses", description: "Ideal plan for sellers who want quick traction and higher visibility", verify: "Verified listings for trust & visibility", available: true },
  };


  const plans_details = plans.map((plan) => ({
    id: plan.id,
    title: `${capitalizeFirstLetter(plan.name)} Plan`,
    price: `${Number(plan.price) % 1 === 0 ? Number(plan.price) : Number(plan.price).toFixed(2)}`,
    description: buyerResponseText[plan.id].description,
    buttonText: "Choose Plan",
    features: [
      { text: buyerResponseText[plan.id].text, available: buyerResponseText[plan.id].available },
      { text: buyerResponseText[plan.id].verify, available: buyerResponseText[plan.id].available },
      { text: `Post any ${plan.max_properties} property (Commercial / Resale / Rent)`, available: true },
      { text: "Featured placement in property searches", available: false },
      { text: `Access upto ${plan.max_property_views} contacts`, available: true },
      { text: "Listing Duration: 1 Month", available: true },
      { text: `Plan Validity: ${plan.validity_days} days `, available: true },
    ],
  }));

  // faqs
  const faqs = [
    {
      question:
        "What are the different subscription plans available on MyPropAI?",
      answer:
        "MyPropAI offers multiple subscription plans tailored for property owners, agents, and developers. Each plan comes with features like property listing credits, premium visibility, lead access, and analytics.",
    },
    {
      question: "How do I choose the right subscription plan?",
      answer:
        "The best plan depends on your requirement. If you are an individual looking to sell or rent, a basic plan may be enough. For agents and developers who want maximum visibility and unlimited leads, higher-tier plans are recommended.",
    },
    {
      question: "Can I upgrade my subscription plan later?",
      answer:
        "Yes, you can upgrade anytime. The remaining value of your current plan will be adjusted against the upgraded plan cost.",
    },
    {
      question: "Are there any free listing options available?",
      answer:
        "Yes, MyPropAI offers limited free listings for first-time users. However, paid plans provide premium placement, higher reach, and verified leads.",
    },
    {
      question: "How can I pay for my subscription?",
      answer:
        "You can pay using credit/debit cards, net banking, UPI, or digital wallets supported on MyPropAI.",
    },
    {
      question: "Will my subscription auto-renew?",
      answer:
        "Yes, subscriptions are set to auto-renew by default. You can manage or cancel auto-renewal anytime in your account settings.",
    },
  ];



  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-0 transform -translate-y-1/2
                   w-10 h-10 flex items-center justify-center
                   bg-[#3B3898] text-white rounded-full cursor-pointer
                   z-10"
      style={{ boxShadow: "0 9px 11px 0 rgba(0, 0, 0, 0.25)" }}
    >
      <img src={arrow_right} alt="Next" className="w-5 h-5" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-0 transform -translate-y-1/2
                   w-10 h-10 flex items-center justify-center
                   bg-[#3B3898] text-white rounded-full cursor-pointer
                   z-10"
      style={{ boxShadow: "0 9px 11px 0 rgba(0, 0, 0, 0.25)" }}
    >
      <img src={arrow_left} alt="Previous" className="w-5 h-5" />
    </div>
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
  };


  const toggleShowMore = (id) => {
    setShowMore((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-bold text-[24px] leading-[30px] mb-1 text-[#3B3898]">
          Subscription Plans
        </h1>

        <p className="text-[14px] leading-[21px] font-normal mb-8 text-[#36334D]">
          Pick a plan to sell properties
        </p>

        {/* Plans Section */}
        <div className="grid  grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-start">
          {plans_details.map((plan) => (
            <div
              key={plan.id}
              className="border relative border-[#C0C0C0] rounded-[16px] p-6 flex flex-col"
            >
              <h2 className="text-[20px] font-bold mb-2 leading-normal text-[#36334D]">
                {plan.title}
              </h2>
              <p className="text-[38px] font-bold text-[#8A38F5] mb-2">₹{plan.price} <span className="text-sm font-semibold text-[#36334D]"> {plan.id == 1 ? "(Free 1 Property Post per user)" : "Onwards"}</span></p>
              <p className="text-[16px] font-medium mb-4 text-[#36334D]">
                {plan.description}
              </p>

              <button
                id={plan.id}
                className="bg-[#FFD300] font-medium cursor-pointer text-[#36334D] py-2 px-4 rounded-md mb-4 transition disabled:bg-[#DBDBDB]  disabled:cursor-not-allowed"
                onClick={() => handlePayment(plan.id, userId, plan.price)}
                disabled={subcriptionData.plan_id === plan.id}
              >
                {
                  subcriptionData.plan_id === plan.id
                    ? `${plan.title} Activated`
                    : plan.id === 1
                      ? "Continue For Free"
                      : plan.buttonText
                }

              </button>

              <ul className="flex-1 space-y-4 text-[14px] font-medium text-[#36334D]">
                {(showMore[plan.id] ? plan.features : plan.features.slice(0, 5)).map(
                  (feature, fIdx) => (
                    <li key={fIdx} className="flex items-center">
                      <img
                        src={feature.available ? tick : close}
                        alt={feature.available ? "Available" : "Not available"}
                        className="w-4 h-4 mr-2"
                      />
                      {feature.text}
                    </li>
                  )
                )}
              </ul>

              {/* ribbon of active plan */}
              {(subcriptionData.plan_id === plan.id) && (
                <div className="absolute top-4 -right-[1px] ">
                  <div className="relative" >
                    <img src={ribbon_icon} alt="current-plan" />
                    <div className="absolute top-1 left-6 font-bold text-white">Current Plan</div>
                  </div>
                </div>)}

              {plan.features.length > 5 && (
                <div
                  className="mt-2 text-sm font-bold text-[#8A38F5] cursor-pointer"
                  onClick={() => toggleShowMore(plan.id)}
                >
                  {showMore[plan.id] ? "Show Less" : "Show More"}
                </div>
              )}
              {isActivated && (
                <DialogBox isOpen={isActivated} onClose={() => { setIsActivated(false) }}>
                  <div className="flex flex-col  justify-center items-center">
                    <img src={payment_successful} alt="Payment-successful" />
                    <div className="font-bold text-md text-[#8A38F5] mt-4">Subscription  Activated</div>
                    <div className="text-sm mt-4">Congratulations! Your “{plan.title} Subscription Plan” has been activated </div>
                    <div className="tezr-sm">successfully.</div>
                    <Button className="bg-[#8a38f5] text-white font-bold px-6 mt-4 cursor-pointer" onClick={() => { setIsActivated(false) }}>Close</Button>
                  </div>
                </DialogBox>
              )}

            </div>
          ))}

        </div>


        {/* Custom Plan Form */}
        <div className="flex flex-col md:flex-row max-w-[1400px] mx-auto my-10 shadow-lg rounded-xl overflow-hidden">
          {/* Left Side */}
          <div
            className="w-full md:w-1/2 text-white p-10 bg-cover bg-center flex flex-col justify-center"
            style={{
              backgroundImage: `linear-gradient(172deg, rgba(12, 0, 68, 0.8), rgba(78, 63, 151, 0.6)), url(${banner})`,
            }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              List Your Property
              <br />
              <span className="text-[#FFD300]">Free</span> with{" "}
              <span className="text-[#FFD300]">My Prop AI</span>
            </h1>
            <ul className="space-y-4 text-lg">
              <ListItem
                icon={ListHomeIcon}
                text="Post your property for"
                highlight="Free."
              />
              <ListItem
                icon={ListHomeIcon}
                text="Get accessed by more"
                highlight="1 lakhs buyers."
              />
              <ListItem
                icon={ListHomeIcon}
                text="Get daily update of"
                highlight="Our property."
              />
              <ListItem
                icon={ListHomeIcon}
                text="Get latest trends and"
                highlight="Market price."
              />
            </ul>
            <h3 className="text-[#FFD300] text-2xl font-bold mt-6">
              Sell or Rent your Property
            </h3>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
            <h2 className="text-[#3B3898] text-2xl font-bold leading-[30px] mb-1">
              Custom Plans
            </h2>

            <p className="text-gray-500 text-sm font-normal leading-[21px] tracking-[0.14px] mb-6">
              Discuss for Custom Subscription Plans
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* First + Last Name */}
              <div className="flex gap-3">
                <InputField
                  label="First Name"
                  name="first_name"
                  placeholder="Enter First Name"
                  value={formik.values.first_name}
                  onChange={(e) => {
                    const filtered = filterTextOnly(e.target.value);
                    formik.setFieldValue("first_name", filtered);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.first_name && formik.errors.first_name ? formik.errors.first_name : null}
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter Last Name"
                  value={formik.values.last_name}
                  onChange={(e) => {
                    const filtered = filterTextOnly(e.target.value);
                    formik.setFieldValue("last_name", filtered);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.last_name && formik.errors.last_name ? formik.errors.last_name : null}
                />
              </div>

              {/* Phone */}
              <InputField
                label="Phone Number"
                name="phone"
                placeholder="Enter your phone number"
                value={formik.values.phone}
                onChange={(e) => {
                  const filtered = isValidMobile(e.target.value);
                  formik.setFieldValue("phone", filtered);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : null}
              />

              {/* Comments */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Comments
                </label>
                <textarea
                  name="comments"
                  placeholder="Enter your Comments"
                  value={formik.values.comments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows="3"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-[#FFD300] text-[#36334D] font-semibold rounded-lg py-2 mt-2 hover:bg-yellow-400"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-[#3B3898] text-2xl font-bold leading-[30px] mb-1">
            FAQs
          </h2>
          <p className="text-gray-500 text-sm font-normal leading-[21px] tracking-[0.14px] mb-6">
            Frequently Asked Questions
          </p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className=" rounded-[12px] p-4 cursor-pointer hover:bg-gray-50 transition bg-white shadow-[0_0_2px_rgba(0,0,0,0.24)]"
                onClick={() => toggleFAQ(idx)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#36334D] text-sm leading-[21px] tracking-[0.14px]">
                    {faq.question}
                  </p>
                  <img
                    src={openIndex === idx ? minus : plus}
                    alt="toggle"
                    className="w-4 h-4"
                  />
                </div>
                {openIndex === idx && (
                  <p className="text-[#878787] text-sm font-medium leading-[21px] tracking-[0.14px] mt-3">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12">
          <h2 className="text-[#3B3898] text-2xl font-bold leading-[30px] mb-1">
            Testimonials
          </h2>
          <p className="text-gray-500 text-sm font-normal leading-[21px] tracking-[0.14px] mb-6">
            What Our Users Say
          </p>

          <div className="relative">
            <Slider
              dots={false}
              infinite={false}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              nextArrow={<NextArrow />}
              prevArrow={<PrevArrow />}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: { slidesToShow: 2, slidesToScroll: 1 },
                },
                {
                  breakpoint: 640,
                  settings: { slidesToShow: 1, slidesToScroll: 1 },
                },
              ]}
            >
              {[
                {
                  name: "Aman Jain",
                  text: "My experience with MyPropAI was excellent. The quality of the leads was superb. I thank MyPropAI team for their support.",
                },
                {
                  name: "Nikhil Thakar",
                  text: "My experience with MyPropAI was excellent. The quality of the leads was superb. I thank MyPropAI team for their support.",
                },
                {
                  name: "Dejaneshwar Shetty",
                  text: "My experience with MyPropAI was excellent. The quality of the leads was superb. I thank MyPropAI team for their support.",
                },
                {
                  name: "Priya Sharma",
                  text: "The platform is very user-friendly. I was able to post my property easily and got genuine leads quickly.",
                },
              ].map((t, idx) => (
                <div key={idx} className="p-2">
                  <div className="rounded-[12px] p-4 cursor-pointer hover:bg-gray-50 transition bg-white shadow-[0_0_2px_rgba(0,0,0,0.24)] h-full">
                    <p className="text-[#36334D] text-[12px] font-normal leading-[19px] tracking-[0.12px] text-justify mb-2">
                      {t.text}
                    </p>
                    <p className="font-semibold text-[#36334D] text-[12px] tracking-[0.12px] leading-normal">
                      {t.name}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* form submit succes pop up */}
      {showSuccess && (
        <DialogBox isOpen={showSuccess} onClose={() => { setShowSuccess(false) }}>
          <div className="flex flex-col  justify-center items-center">
            <img src={payment_successful} alt="Payment-successful" />
            <div className="font-bold text-md text-[#8A38F5] mt-4">Successfully Submitted</div>
            <div className="text-sm mt-4 ">
              Thanks for your submission! We will contact you shortly.
            </div>
            <Button className="bg-[#8a38f5] text-white font-bold px-6 mt-4 cursor-pointer" onClick={() => { setShowSuccess(false) }}>Close</Button>
          </div>
        </DialogBox>
      )
      }
    </>
  );
}

function InputField({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}) {
  return (
    <div className="w-full">
      <label className="block text-[#36334D] text-[15px] font-medium leading-normal mb-1">
        {label}
      </label>

      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full border rounded-lg p-2 focus:outline-none ${error
          ? "border-red-500 focus:ring-2 focus:ring-red-400"
          : "border-gray-300 focus:ring-2 focus:ring-yellow-400"
          }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function ListItem({ icon, text, highlight }) {
  return (
    <li className="flex items-center gap-2">
      <img src={icon} alt="icon" className="w-5 h-5" />
      <span>
        {text} <b>{highlight}</b>
      </span>
    </li>
  );
}

export default Plans;
