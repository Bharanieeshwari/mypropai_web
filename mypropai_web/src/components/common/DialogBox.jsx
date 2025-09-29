import { IoMdClose } from "react-icons/io";

const DialogBox = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-[#2B2A36CC]/30 z-50 p-4">
      <div
        className={`relative text-[#36334D] top-20 bg-white mx-10 p-[20px] ${className}`}
      >
        <button
          className="absolute top-2 right-1 text-2xl z-10"
          onClick={onClose}
        >
          <IoMdClose className="cursor-pointer text-black" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default DialogBox;
