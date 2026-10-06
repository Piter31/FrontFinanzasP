"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/landing/data";
import { Reveal, Section, SectionHeading } from "./ui";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <Reveal>
        <SectionHeading eyebrow="FAQ" title="Preguntas frecuentes" />
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800/60 dark:border-zinc-800 dark:bg-zinc-900">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-zinc-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
