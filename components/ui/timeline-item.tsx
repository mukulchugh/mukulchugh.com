"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";

interface TimelineItemProps {
  title: string;
  company: string;
  location: string;
  date: string;
  description?: readonly string[];
  icon: string;
  index: number;
}

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * index,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export function TimelineItem({
  title,
  company,
  location,
  date,
  description,
  icon,
  index,
}: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative flex items-start"
      variants={fadeInAnimationVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      custom={index}
    >
      {/* Icon circle - positioned on the timeline */}
      <div
        className={cn(
          "absolute z-10 flex items-center justify-center",
          "w-16 h-16 rounded-full bg-white border-4 border-gray-700 overflow-hidden",
          "left-0 md:left-1/2 md:-translate-x-1/2",
          "-translate-x-2"
        )}
      >
        <Image
          src={icon}
          alt={company}
          width={40}
          height={40}
          className="object-contain rounded-full"
        />
      </div>

      {/* Card container - alternates sides on desktop */}
      <div
        className={cn(
          "w-full pl-20 md:pl-0 md:w-[calc(50%-2.5rem)]",
          isEven ? "md:mr-auto md:pr-4 md:text-right" : "md:ml-auto md:pl-4"
        )}
      >
        <div
          className={cn(
            "relative p-5 rounded-lg border shadow-none",
            "bg-white/5 border-white/10"
          )}
        >
          {/* Arrow pointing to timeline - hidden on mobile */}
          <div
            className={cn(
              "hidden md:block absolute top-6 w-0 h-0",
              "border-[0.4rem] border-transparent",
              isEven
                ? "right-[-0.8rem] border-l-gray-500"
                : "left-[-0.8rem] border-r-gray-500"
            )}
          />

          {/* Date */}
          <span className={cn(
            "text-sm text-gray-400 block mb-2",
            isEven ? "md:text-right" : "md:text-left"
          )}>
            {date}
          </span>

          {/* Title */}
          <h3 className={cn(
            syne.className,
            "font-semibold capitalize text-lg",
            isEven ? "md:text-right" : "md:text-left"
          )}>
            {title}
          </h3>

          {/* Company & Location */}
          <p className={cn(
            "font-normal text-sm text-gray-500 mt-1",
            isEven ? "md:text-right" : "md:text-left"
          )}>
            {company} | {location}
          </p>

          {/* Description */}
          {description && (
            <div className={cn(
              "mt-3 font-normal text-white/75 text-sm",
              isEven ? "md:text-right" : "md:text-left"
            )}>
              {description.map((desc, idx) => (
                <p key={idx} className="mb-1">
                  - {desc}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
