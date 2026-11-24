import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

function AuthLayout({ children, title, subtitle, imageSide = false }) {
  return (
    <div className="min-h-screen bg-[#f8f8f5] flex">

      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 lg:px-20 py-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="bg-[#253b35] text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xl">
            R
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#253b35]">
            retrievo
          </span>
        </Link>

        {/* Form Area */}
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto py-12">

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#253b35] mb-8"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#253b35]">
            {title}
          </h1>

          <p className="text-gray-500 mt-3 mb-8">
            {subtitle}
          </p>

          {children}
        </div>

        <p className="text-xs text-gray-400 text-center">
          © 2026 Retrievo. Made for campus communities.
        </p>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#253b35] relative overflow-hidden items-center justify-center p-16">

        <div className="absolute w-96 h-96 border border-white/10 rounded-full -top-20 -right-20" />
        <div className="absolute w-[500px] h-[500px] border border-white/10 rounded-full -bottom-40 -left-20" />

        <div className="relative z-10 max-w-lg text-white">

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12">

            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-white/70">
                CAMPUS COMMUNITY
              </span>
              <Search size={20} />
            </div>

            <div className="bg-[#f8f8f5] rounded-xl p-5 text-[#253b35]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#e6e9dc] rounded-lg flex items-center justify-center text-2xl">
                  🎒
                </div>

                <div>
                  <h3 className="font-semibold">Lost backpack</h3>
                  <p className="text-xs text-gray-500">
                    Library · Reported today
                  </p>
                </div>

                <span className="ml-auto text-xs bg-[#e6e9dc] px-3 py-1 rounded-full">
                  Found
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <div className="bg-[#d5e2d1] text-[#253b35] px-4 py-2 rounded-full text-sm font-medium">
                ✓ Successfully recovered
              </div>
            </div>

          </div>

          <p className="text-sm tracking-[3px] text-[#b7c5b0] mb-5">
            LOST SOMETHING? FOUND SOMETHING?
          </p>

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Good things find their way back.
          </h2>

          <p className="text-white/60 mt-6 leading-relaxed">
            A campus where students help each other reconnect
            with the things that matter.
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthLayout;