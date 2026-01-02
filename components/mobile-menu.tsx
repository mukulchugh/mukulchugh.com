import React, { useState } from "react";
import { motion, type Variants } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { syne } from "@/lib/fonts";
import Link from "next/link";

const MOBILE_NAV_ITEMS = [
  {
    id: 0,
    navTitle: "home",
    href: "#home",
  },
  {
    id: 1,
    navTitle: "about",
    href: "#about",
  },
  {
    id: 2,
    navTitle: "projects",
    href: "#projects",
  },
  {
    id: 3,
    navTitle: "skills",
    href: "#skills",
  },
  {
    id: 4,
    navTitle: "blog",
    href: "/blog",
  },
  {
    id: 5,
    navTitle: "experience",
    href: "#experience",
  },
  {
    id: 6,
    navTitle: "contact",
    href: "#contact",
  },
];

const MobileMenu = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const hideNavItemsVariant: Variants = {
    opened: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
    closed: {
      opacity: 1,
      y: "0%",
      transition: {
        delay: 1.1,
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
  };

  const mobileMenuVariant: Variants = {
    opened: {
      y: "0%",
      transition: {
        delay: 0.15,
        duration: 1.1,
        ease: [0.74, 0, 0.19, 1.02],
      },
    },
    closed: {
      y: "-100%",
      transition: {
        delay: 0.35,
        duration: 0.63,
        ease: [0.74, 0, 0.19, 1.02],
      },
    },
  };

  const fadeInVariant: Variants = {
    opened: {
      opacity: 1,
      transition: {
        delay: 1.2,
      },
    },
    closed: { opacity: 0 },
  };

  const ulVariant: Variants = {
    opened: {
      transition: {
        delayChildren: 1,
        staggerChildren: 0.18,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.06,
        staggerDirection: -1,
      },
    },
  };

  const liVariant: Variants = {
    opened: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.65,
        ease: "easeOut" as const,
      },
    },
    closed: {
      opacity: 0,
      y: "100%",
      transition: {
        duration: 0.25,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <nav className={clsx("container flex md:hidden", syne.className)}>
      <motion.nav
        initial="closed"
        animate={mobileNavOpen ? "opened" : "closed"}
      >
        <div>
          <motion.div
            variants={hideNavItemsVariant}
            onClick={() => setMobileNavOpen(true)}
          >
            <IconMenu2 className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </motion.div>
        </div>
        <motion.div
          variants={mobileMenuVariant}
          className="mobile-menu dark:bg-black"
        >
          <motion.button
            variants={fadeInVariant}
            onClick={() => setMobileNavOpen(false)}
          >
            <IconX className="h-6 w-6 text-gray-900 dark:text-white" />
          </motion.button>
          <motion.ul variants={ulVariant}>
            {MOBILE_NAV_ITEMS.map((navItem) => (
              <Link key={navItem.id} href={navItem.href}>
                <motion.li whileTap={{ scale: 0.95 }} key={navItem.id}>
                  <motion.div
                    onClick={() => setMobileNavOpen(false)}
                    variants={liVariant}
                    className="dark:text-white"
                  >
                    {navItem.navTitle}
                  </motion.div>
                </motion.li>
              </Link>
            ))}
          </motion.ul>
        </motion.div>
      </motion.nav>
    </nav>
  );
};

export default MobileMenu;
