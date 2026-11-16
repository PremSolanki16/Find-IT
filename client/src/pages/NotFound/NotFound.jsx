
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found-page relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Background decoration */}
      <div className="not-found-glow not-found-glow-one" />
      <div className="not-found-glow not-found-glow-two" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">

        {/* Floating illustration */}
        <div className="not-found-illustration relative mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10 sm:mb-7 sm:h-36 sm:w-36">
          <div className="absolute inset-2 rounded-full border border-dashed border-purple-400/40 not-found-orbit" />

          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="h-14 w-14 text-purple-300 sm:h-20 sm:w-20"
            aria-hidden="true"
          >
            <path
              d="M50 13L57 38L83 45L57 53L50 80L43 53L17 45L43 38L50 13Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="50" cy="45" r="8" fill="#080D2B" />
            <path
              d="M43 65L50 72L57 65"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <span className="absolute -right-1 top-4 h-3 w-3 rounded-full bg-purple-300 not-found-pulse" />
          <span className="absolute -bottom-1 left-5 h-2.5 w-2.5 rounded-full bg-indigo-300 not-found-pulse-delay" />
        </div>

        {/* Error content */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-purple-300 sm:text-sm">
          Lost your way?
        </p>

        <h1 className="not-found-number mb-2 text-[clamp(6rem,22vw,12rem)] font-black leading-[0.85] tracking-tight">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Page Not Found
        </h2>

        <p className="mb-8 max-w-md px-2 text-sm leading-relaxed text-slate-300 sm:mb-10 sm:text-base">
          Looks like this page has gone missing!
          Don't worry, let's help you find your way back to Find&IT.
        </p>

        {/* Action buttons */}
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            to="/"
            className="not-found-home-button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold sm:w-auto"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M3 10.5L12 3L21 10.5V20H14.5V14H9.5V20H3V10.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="not-found-back-button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-7 py-3 text-sm font-bold sm:w-auto"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go Back
          </button>
        </div>

        <p className="mt-10 text-xs text-slate-500 sm:mt-12">
          Find&IT · Lost something? Find it here.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
