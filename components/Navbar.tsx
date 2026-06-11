"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  {
    label: "Library",
    href: "/",
  },
  {
    label: "Add New",
    href: "/books/new",
  },
  { label: "Pricing", href: "/subscriptions" },
];

const Navbar = () => {
  const pathName = usePathname();

  return (
    <>
      <header className="w-full fixed z-50 bg-(--bg-primary)">
        <div className="wrapper navbar-height py-4 flex justify-between items-center">
          <Link href={"/"} className="flex gap-0.5 items-center">
            <Image src={"/logo.svg"} alt="Book Sphere" width={42} height={26} />
            <span className="logo-text">Book Sphere</span>
          </Link>

          <nav className="w-fit flex gap-7.5 items-center">
            {navItems.map(({ label, href }) => {
              const isActive =
                href === pathName ||
                (href !== "/" && pathName.startsWith(href));

              return (
                <Link
                  href={href}
                  key={label}
                  className={cn(
                    "nav-link-base",
                    isActive
                      ? "nav-link-active"
                      : "text-black hover:opacity-70",
                  )}
                >
                  {label}
                </Link>
              );
            })}

            <div className="flex gap-7.5 items-center">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="nav-link-base cursor-pointer text-black hover:opacity-70">
                    Sign In
                  </button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
                <div className="nav-user-link">
                  <UserButton />
                  {/* {user?.firstName && (
                    <Link href={"/subscriptions"} className="nav-user-name">
                      {user.firstName}
                    </Link>
                  )} */}
                </div>
              </Show>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
