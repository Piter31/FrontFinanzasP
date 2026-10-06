import { Quote, User } from "lucide-react";
import { Card } from "@/components/card";
import { testimonialSlots } from "@/lib/landing/data";
import { Badge, Reveal, Section, SectionHeading } from "./ui";

export function Testimonials() {
  return (
    <Section id="testimonios">
      <Reveal>
        <SectionHeading
          eyebrow="Testimonios"
          title="Lo que dicen quienes ya ordenan sus finanzas"
          description="Todavía estamos reuniendo las primeras opiniones reales de nuestros usuarios."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {testimonialSlots.map((slot, index) => (
          <Reveal key={slot.id} delay={index * 100} className="h-full">
            <Card className="flex h-full flex-col p-6">
              <Quote
                aria-hidden
                className="size-5 text-zinc-300 dark:text-zinc-600"
              />
              <p className="mt-4 flex-1 text-sm text-zinc-500 italic dark:text-zinc-400">
                {slot.comment}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <User aria-hidden className="size-5 text-zinc-400" />
                </span>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                  Tu nombre
                </p>
                <span className="ml-auto shrink-0">
                  <Badge tone="zinc">{slot.plan}</Badge>
                </span>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-8 text-center text-xs text-zinc-400">
          Espacios reservados: los testimonios reales van a aparecer acá apenas
          los tengamos.
        </p>
      </Reveal>
    </Section>
  );
}
