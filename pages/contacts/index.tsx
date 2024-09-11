import ContactForm from "@/components/ui/Business/Contact/ContactForm";

export default function Page() {
  return (
    <section className="pb-24 pt-20">
      <div className="container max-w-3xl">
        <h1 className="title text-xl mb-8">
          Lett&apos;s Build Something Great Together!
        </h1>
        <p className="text-muted-foreground text-md">
          I'm always excited to explore new opportunities and collaborations. If
          you have an interesting project or idea, I'd love to hear about it.
          Drop me a message, and let's make it happen!
        </p>
        <ContactForm></ContactForm>
      </div>
    </section>
  );
}
