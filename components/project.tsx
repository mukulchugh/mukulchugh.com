"use client";

import { useRef } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BsGithub, BsGlobe } from "react-icons/bs";

type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  description,
  tags,
  github,
  demo,
}: // imageUrl,

ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      className="group mb-3 sm:mb-8 last:mb-0"
    >
      <section className="bg-gray-100 max-w-[44rem] border border-black/5 rounded-lg overflow-hidden sm:pr-8 md:p-4 relative sm:h-[15rem] hover:bg-gray-200 transition sm:group-even:pl-8 md:group-even:pl-4 dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="pt-4 pb-0 px-2 sm:pl-10 sm:pr-2 sm:pt-10 md:p-0 sm:max-w-[100%] flex flex-col h-full">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          {Array.isArray(tags) && (
            <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto md:mt-4">
              {tags.map((tag, index) => (
                <li
                  className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                  key={index}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-auto sm:ml-auto sm:gap-4">
            {github && (
              <a href={github} className="btn mt-4" target="_blank">
                <BsGithub className="inline-block mr-2" />
                Github
              </a>
            )}
            {demo && (
              <a href={demo} className="btn mt-4" target="_blank">
                <BsGlobe className="inline-block mr-2" />
                Demo
              </a>
            )}
          </div>
        </div>

        {/* <Image
          src={imageUrl}
          alt="Project I worked on"
          quality={95}
          className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl
        transition 
        group-hover:scale-[1.04]
        group-hover:-translate-x-3
        group-hover:translate-y-3
        group-hover:-rotate-2

        group-even:group-hover:translate-x-3
        group-even:group-hover:translate-y-3
        group-even:group-hover:rotate-2

        group-even:right-[initial] group-even:-left-40"
        /> */}
      </section>
    </motion.div>
  );
}
