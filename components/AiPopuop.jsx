import React from "react";
import AnimateNav from "@/components/ui/Animations/AnimateNav";
import { slideInLeft } from "@/Constant";

const AiPopuop = () => {
  return (
    <AnimateNav animation={slideInLeft}>
      <div className=" flex justify-center mt-20">
        <button className=" bg-transparent  border border-gray-300 text-black shadow-none mt-10 py-4 px-12 rounded-md">
          <span className="  border border-gray-300 px-1 rounded-2xl mr-4 text-xs font-light">
            New
          </span>
          Hi, i'm Solacely AI
        </button>
      </div>
    </AnimateNav>
  );
};

export default AiPopuop;
