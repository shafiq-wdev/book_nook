"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, SparklesIcon } from "lucide-react";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";

const slides = [
  {
    eyebrow: "Welcome to BookNook",
    title: "Find your next favorite book.",
    text: "Borrow from a community of readers and let every story find another set of hands.",
    gradient: "from-slate-950 via-indigo-950 to-violet-900",
    glow: "bg-violet-500/30",
    featured: {
      title: "The Midnight Library",
      author: "Matt Haig",
    },
  },
  {
    eyebrow: "Share your shelf",
    title: "Give the books you love a second life.",
    text: "Add the titles already on your shelf, set their availability, and lend them to readers nearby.",
    gradient: "from-amber-950 via-orange-900 to-rose-900",
    glow: "bg-orange-400/25",
    featured: {
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
    },
  },
  {
    eyebrow: "A reading community",
    title: "Every story deserves another reader.",
    text: "Track your borrows, discover fresh arrivals, and keep great books moving through the neighborhood.",
    gradient: "from-emerald-950 via-teal-900 to-cyan-900",
    glow: "bg-cyan-400/25",
    featured: {
      title: "Project Hail Mary",
      author: "Andy Weir",
    },
  },
];

function BookStack({ title, author }) {
  return (
    <div
      className="relative hidden h-[360px] w-[330px] shrink-0 lg:block"
      aria-hidden="true"
    >
      <div className="absolute top-14 left-2 h-64 w-44 rotate-[-12deg] rounded-2xl bg-white/10 p-5 shadow-2xl ring-1 ring-white/15 backdrop-blur-sm">
        <BookOpenIcon className="size-5 text-white/50" />
        <p className="mt-24 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
          BookNook picks
        </p>
      </div>
      <div className="absolute top-6 right-1 h-64 w-44 rotate-[9deg] rounded-2xl bg-white/15 p-5 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
        <BookOpenIcon className="size-5 text-white/50" />
        <p className="mt-24 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
          New arrivals
        </p>
      </div>
      <div className="absolute top-20 left-1/2 h-72 w-48 -translate-x-1/2 rotate-[-2deg] rounded-2xl bg-gradient-to-br from-white to-slate-200 p-5 shadow-2xl ring-1 ring-white/30">
        <BookOpenIcon className="size-5 text-slate-400" />
        <div className="mt-24">
          <p className="font-heading text-sm leading-tight font-semibold text-slate-900">
            {title}
          </p>
          <p className="mt-1 text-xs text-slate-500">{author}</p>
        </div>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [swiper, setSwiper] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!swiper || paused) return undefined;

    const timer = window.setInterval(() => {
      swiper.slideNext();
    }, 5500);

    return () => window.clearInterval(timer);
  }, [paused, swiper]);

  return (
    <section aria-label="Featured highlights" className="border-b">
      <Swiper
        modules={[EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        navigation
        pagination={{ clickable: true }}
        onSwiper={setSwiper}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="hero-swiper h-[540px] w-full sm:h-[580px] lg:h-[620px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title} className="h-full">
            <div
              className={cn(
                "relative flex h-full items-center overflow-hidden bg-gradient-to-br",
                slide.gradient
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute top-1/2 -right-20 size-[420px] -translate-y-1/2 rounded-full blur-3xl",
                  slide.glow
                )}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
                aria-hidden="true"
              />

              <div className="relative mx-auto grid h-full w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
                <div className="max-w-2xl text-white">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                    <SparklesIcon
                      className="size-3.5 text-white/70"
                      aria-hidden="true"
                    />
                    {slide.eyebrow}
                  </span>
                  <h1 className="mt-6 font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                    {slide.text}
                  </p>
                  <Link
                    href="/books"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mt-8 bg-white text-slate-950 hover:bg-white/90"
                    )}
                  >
                    Browse Books
                    <ArrowRightIcon
                      data-icon="inline-end"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <BookStack
                  title={slide.featured.title}
                  author={slide.featured.author}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
