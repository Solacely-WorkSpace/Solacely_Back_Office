"use client";
import Dropdown from "./Dropdown";
import Image from "next/image";
import MobileNav from "./MobileNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from '@clerk/nextjs';
import { LogoName } from '@/assets/images'
import { LogoIcon } from '@/assets/icons'

const Nav = () => {
  const { user, isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/user/dashboard');

  // Check if user is admin and set appropriate dashboard URL
  useEffect(() => {
    if (isSignedIn && user) {
      const userMetadata = user.publicMetadata;
      const adminStatus = userMetadata.role === 'admin';
      setIsAdmin(adminStatus);
      setDashboardUrl(adminStatus ? '/dashboard' : '/user/dashboard');
    }
  }, [isSignedIn, user]);

  return (
    <nav className=" fixed w-full z-50 bg-white top-0 px-4 py-2">
      <div className="landingpage-container flex justify-between items-center">
        <Link
          href={'/'}
          className=" flex gap-0 md:gap-1.5 items-end"
        >
          <div className="w-8">
            <Image
              src={LogoIcon}
              alt="LogoName"
              width={200}
              height={200}
              className="w-6 md:w-8"
            />
          </div>

          <div className="">
            <Image
              src={LogoName}
              alt="LogoName"
              width={200}
              height={200}
              className="h-4 md:h-6"
            />
          </div>
        </Link>

        <div className=" hidden md:block">
          <ul className=" flex items-center gap-2">
            <Dropdown />

            <li className=" font-medium text-base ">
              <Link href="#" className="font-bold">
                Become a Partner
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <MobileNav />

          {isSignedIn ? (
            <Link
              href={dashboardUrl}
              className="btn-primary px-6 hidden md:block"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="btn-primary px-6 hidden md:block"
            >
              Get Started
            </Link>
          )}
        </div>
      </div >
    </nav >
  );
};

export default Nav;