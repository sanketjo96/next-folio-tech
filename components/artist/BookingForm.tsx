import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { BOOKING_EVENT_TYPES, BookingFormSchema, type BookingInputs } from "@/lib/schema/schemas";
import { track } from "@/lib/analytics";

/**
 * Quick booking form that lives inside the "Book the show" ticket on /artist.
 * Styled for the amber ticket (dark fields on amber). Feedback is inline:
 * the standalone artist page has no Toaster.
 */

const field =
  "w-full rounded-xl border-0 bg-[var(--s-bg)] px-4 py-3 text-[15px] text-[var(--s-ink)] placeholder:text-[var(--s-faint)] outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-[var(--s-bg)]/40 focus:ring-offset-2 focus:ring-offset-[var(--s-amber)]";
const label = "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em]";

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs font-semibold text-red-900">{msg}</p> : null;
}

export default function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const started = useRef(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInputs>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: { name: "", email: "", phone: "", city: "", date: "", details: "", website: "" },
  });

  const onSubmit: SubmitHandler<BookingInputs> = async (booking) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "booking", booking }),
      });
      if (!res.ok) throw new Error(`Booking API responded ${res.status}`);
      track("Artist: Booking sent", { type: booking.eventType });
      setStatus("sent");
      reset();
    } catch (e) {
      track("Artist: Booking failed");
      setStatus("error");
      console.error(e);
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl bg-[var(--s-bg)] p-6 text-[var(--s-ink)]" role="status">
        <CheckCircle2 className="size-8 text-[var(--s-amber)]" />
        <p className="poster text-3xl">Request received!</p>
        <p className="text-sm text-[var(--s-muted)]">I&apos;ll get back to you within a couple of days.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-1 text-sm font-semibold text-[var(--s-amber)] underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={() => {
        if (started.current) return;
        started.current = true;
        track("Artist: Booking started");
      }}
      noValidate
      className="grid gap-3 sm:grid-cols-2"
      aria-label="Quick booking"
    >
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />

      <div>
        <label htmlFor="bk-name" className={label}>Name</label>
        <input id="bk-name" autoComplete="name" placeholder="Your name" className={field} {...register("name")} />
        <Err msg={errors.name?.message} />
      </div>
      <div>
        <label htmlFor="bk-email" className={label}>Email</label>
        <input id="bk-email" type="email" autoComplete="email" placeholder="you@company.com" className={field} {...register("email")} />
        <Err msg={errors.email?.message} />
      </div>
      <div>
        <label htmlFor="bk-phone" className={label}>Phone <span className="opacity-60">(optional)</span></label>
        <input id="bk-phone" type="tel" autoComplete="tel" placeholder="+91 …" className={field} {...register("phone")} />
        <Err msg={errors.phone?.message} />
      </div>
      <div>
        <label htmlFor="bk-type" className={label}>Show type</label>
        <select id="bk-type" defaultValue="" className={field} {...register("eventType")}>
          <option value="" disabled>Choose one</option>
          {BOOKING_EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <Err msg={errors.eventType?.message} />
      </div>
      <div>
        <label htmlFor="bk-date" className={label}>Date <span className="opacity-60">(optional)</span></label>
        <input id="bk-date" type="date" className={field + " [color-scheme:dark]"} {...register("date")} />
      </div>
      <div>
        <label htmlFor="bk-city" className={label}>City</label>
        <input id="bk-city" autoComplete="address-level2" placeholder="Pune" className={field} {...register("city")} />
        <Err msg={errors.city?.message} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="bk-details" className={label}>Details <span className="opacity-60">(optional)</span></label>
        <textarea
          id="bk-details"
          rows={3}
          placeholder="Audience size, language, set length, budget…"
          className={field + " resize-y"}
          {...register("details")}
        />
        <Err msg={errors.details?.message} />
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--s-bg)] px-7 font-bold text-[var(--s-amber)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {isSubmitting ? "Sending…" : "Request a booking"}
        </button>
        {status === "error" && (
          <p className="text-sm font-semibold text-red-900" role="alert">
            Couldn&apos;t send that. Please try again, or DM{" "}
            <a href="https://instagram.com/laugh_with_sanket" className="underline">@laugh_with_sanket</a>.
          </p>
        )}
      </div>
    </form>
  );
}
