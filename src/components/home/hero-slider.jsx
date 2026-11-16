
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRightIcon,
  BookOpenIcon,
  SparklesIcon,
} from "lucide-react";

import { EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Library background image
const libraryImage =
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=85";

// Slides Data
const slides = [
  {
    eyebrow: "Welcome to BookNook",
    title: "Find your next favorite book.",
    text: "Borrow from a community of readers and let every story find another set of hands.",
    featured: [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        color: "from-indigo-950 via-blue-900 to-violet-950",
        symbol: "✦",
      },
      {
        title: "The House in the Cerulean Sea",
        author: "TJ Klune",
        color: "from-cyan-900 via-teal-800 to-emerald-950",
        symbol: "✧",
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        color: "from-slate-950 via-slate-800 to-amber-950",
        symbol: "☼",
      },
    ],
  },
  {
    eyebrow: "Share Your Shelf",
    title: "Give the books you love a second life.",
    text: "Add the titles already on your shelf, set their availability, and lend them to readers nearby.",
    featured: [
      {
        title: "Atomic Habits",
        author: "James Clear",
        color: "from-amber-800 via-orange-800 to-red-950",
        symbol: "✦",
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        color: "from-emerald-950 via-green-800 to-teal-950",
        symbol: "◈",
      },
      {
        title: "Ikigai",
        author: "Héctor García",
        color: "from-rose-950 via-red-800 to-orange-900",
        symbol: "✿",
      },
    ],
  },
  {
    eyebrow: "A Reading Community",
    title: "Every story deserves another reader.",
    text: "Track your borrows, discover fresh arrivals, and keep great books moving through the neighborhood.",
    featured: [
      {
        title: "Educated",
        author: "Tara Westover",
        color: "from-stone-800 via-amber-900 to-yellow-950",
        symbol: "✧",
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        color: "from-orange-800 via-amber-700 to-yellow-950",
        symbol: "☼",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        color: "from-slate-950 via-blue-900 to-indigo-950",
        symbol: "✦",
      },
    ],
  },
];

// Three Book Covers
function BookStack({ books }) {
  return (
    <div
      className="relative mx-auto flex h-[320px] w-full max-w-[430px] items-center justify-center sm:h-[390px] lg:h-[470px]"
      aria-label="Featured books"
    >
      {/* Background glow */}
      <div className="absolute size-[280px] rounded-full bg-honey/20 blur-[90px] sm:size-[350px]" />

      <div className="relative flex items-center justify-center -space-x-8 sm:-space-x-10">
        {books.map((book, index) => {
          const rotations = [
            "-rotate-12 translate-y-8",
            "rotate-0 -translate-y-5",
            "rotate-12 translate-y-8",
          ];

          return (
            <div
              key={book.title}
              className={cn(
                "relative aspect-[2/3] w-[105px] shrink-0 overflow-hidden rounded-lg border border-white/20 shadow-2xl transition-all duration-500 hover:z-30 hover:-translate-y-4 hover:scale-105 sm:w-[140px] lg:w-[155px]",
                rotations[index]
              )}
              style={{
                zIndex: index === 1 ? 10 : 5,
              }}
            >
              {/* Book cover */}
              <div
                className={cn(
                  "relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br p-3 sm:p-4",
                  book.color
                )}
              >
                {/* Decorative elements */}
                <div className="absolute -right-12 -top-12 size-36 rounded-full border border-white/20" />

                <div className="absolute -bottom-10 -left-10 size-36 rounded-full border border-white/20" />

                <div className="absolute inset-y-0 left-0 w-2 bg-black/20" />

                {/* Top */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <BookOpenIcon className="size-4 text-white/80" />

                    <span className="text-[7px] tracking-widest text-white/60">
                      BOOKNOOK
                    </span>
                  </div>

                  <div className="mt-8 sm:mt-12">
                    <span className="text-2xl text-honey">
                      {book.symbol}
                    </span>

                    <h3 className="mt-2 font-serif text-base leading-tight font-bold text-white sm:text-xl">
                      {book.title}
                    </h3>

                    <div className="mt-3 h-0.5 w-8 bg-white/60" />
                  </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                  <p className="text-[8px] leading-relaxed text-white/70 sm:text-[10px]">
                    A story worth discovering
                  </p>

                  <p className="mt-2 text-[8px] font-semibold tracking-wider text-white/90 uppercase sm:text-[10px]">
                    {book.author}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating label */}
      <div className="absolute bottom-0 right-0 z-20 rounded-2xl border border-white/20 bg-espresso/80 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:bottom-5 sm:right-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-honey/20 text-honey">
            <BookOpenIcon className="size-5" />
          </div>

          <div>
            <p className="text-xs font-bold">
              Discover your next read
            </p>
            <p className="text-[11px] text-white/60">
              Stories worth sharing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Hero Slider
export function HeroSlider() {
  const [swiper, setSwiper] = useState(null);
  const [paused, setPaused] = useState(false);

  // Auto slide
  useEffect(() => {
    if (!swiper || paused) return;

    const timer = window.setInterval(() => {
      if (!swiper.destroyed) {
        swiper.slideNext();
      }
    }, 5500);

    return () => window.clearInterval(timer);
  }, [swiper, paused]);

  return (
    <section
      aria-label="Featured highlights"
      className="relative overflow-hidden border-b border-border bg-espresso"
    >
      <Swiper
        modules={[EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop
        navigation
        pagination={{ clickable: true }}
        onSwiper={setSwiper}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="hero-swiper h-[650px] w-full sm:h-[680px] lg:h-[680px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.eyebrow}>
            <div className="relative flex h-full items-center overflow-hidden">
              {/* Library Background */}
              <div
                className="absolute inset-0 scale-105 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${libraryImage}")`,
                }}
                aria-hidden="true"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-espresso/75" />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/85 to-espresso/35" />

              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-20 top-1/2 size-[400px] -translate-y-1/2 rounded-full bg-honey/15 blur-[100px]" />

              {/* Content */}
              <div className="relative mx-auto grid h-full w-full max-w-7xl items-center gap-5 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-10">
                {/* Left Content */}
                <div className="relative z-10 max-w-2xl text-white">
                  {/* Eyebrow */}
                  <span className="inline-flex items-center gap-2 rounded-full border border-honey/30 bg-honey/10 px-4 py-2 text-xs font-semibold text-honey backdrop-blur-md sm:text-sm">
                    <SparklesIcon className="size-4" />
                    {slide.eyebrow}
                  </span>

                  {/* Heading */}
                  <h1 className="mt-6 font-serif text-4xl leading-[1.12] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                    {slide.text}
                  </p>

                  {/* CTA */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/books"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-12 rounded-full bg-honey px-7 font-semibold text-espresso shadow-lg shadow-honey/20 transition-all hover:-translate-y-1 hover:bg-honey/90"
                      )}
                    >
                      <BookOpenIcon className="size-5" />
                      Browse Books
                      <ArrowRightIcon
                        data-icon="inline-end"
                        className="size-4"
                      />
                    </Link>

                    <div className="flex items-center gap-2 text-sm font-medium text-white/75">
                      <div className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                        <SparklesIcon className="size-4 text-honey" />
                      </div>
                      A community of readers
                    </div>
                  </div>

                  {/* Bottom Features */}
                  <div className="mt-10 flex flex-wrap gap-x-7 gap-y-5 border-t border-white/20 pt-7 sm:mt-12">
                    <div>
                      <p className="text-lg font-bold text-white">
                        Share
                      </p>
                      <p className="text-xs text-white/60">
                        Your Favorite Books
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-bold text-white">
                        Discover
                      </p>
                      <p className="text-xs text-white/60">
                        New Stories
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-bold text-white">
                        Connect
                      </p>
                      <p className="text-xs text-white/60">
                        With Readers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Book Covers */}
                <BookStack books={slide.featured} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
