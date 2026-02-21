import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center select-none cursor-pointer group">
      {/* INTEGRATED TYPOGRAPHY LOGO */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          {/* T - U - C - K - E - T (with integrated Bat) */}
          <div className="flex items-center">
            <span className="text-3xl font-[1000] text-white uppercase tracking-tighter">T</span>
            
            {/* THE BAT as the letter 'I' */}
            <div className="relative mx-0.5"> {/* Reduced from mx-1 */}
              <div className="w-2.5 h-8 bg-white rounded-t-sm rounded-b-md shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:bg-[#4f8cff] transition-all duration-300 transform group-hover:rotate-5">
                {/* Grip detail */}
                <div className="absolute top-0 left-0 w-full h-2.5 bg-[#4f8cff] group-hover:bg-white rounded-t-sm"></div>
              </div>
            </div>

            <span className="text-3xl font-[1000] text-white uppercase tracking-tighter">CKET</span>
          </div>

          {/* THE BALL - Positioned tightly between the two words */}
          <div className="relative mx-1 self-end pb-1"> {/* Reduced from mx-2 */}
            <div className="w-5 h-5 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full border-2 border-white shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover:translate-y-[-15px] transition-all duration-500 ease-out">
              {/* Stitching / Seam */}
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-white/40 -rotate-45"></div>
            </div>
            {/* Shadow under ball when it jumps */}
            <div className="absolute -bottom-1 left-1 w-3 h-1 bg-black/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* ARENA */}
          <span className="text-3xl font-[1000] text-[#4f8cff] uppercase tracking-tighter italic">
            ARENA
          </span>
        </div>

        {/* BOTTOM ACCENT: The Boundary Line */}
        <div className="flex items-center gap-1 mt-1">
          <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 rounded-full opacity-50"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
            Home of Cricket Glory
          </span>
          <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;