import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full">
      <div className="w-full md:max-w-3xl xl:max-w-6xl mx-auto flex items-center justify-between py-8 px-4">
        {/* <div className="hidden sm:block">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={200}
            height={100}
          />
        </div>
        <div className="block sm:hidden">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={150}
            height={75}
          />
        </div> */}

        <div>
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={200}
            height={100}
            className="w-36 sm:w-52 h-auto"
          />
        </div>

        <button className="py-2 px-3 border rounded-md flex gap-2 bg-Neutral-600 cursor-pointer hover:border-white duration-300">
          <Image
            src="/assets/images/icon-units.svg"
            alt="units-icon"
            width={12}
            height={12}
          />
          <p className="text-white text-xs">Units</p>
          <Image
            src="/assets/images/icon-dropdown.svg"
            alt="dropdown-icon"
            width={12}
            height={12}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
