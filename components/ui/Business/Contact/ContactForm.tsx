import { ContactFormSchema } from "@/lib/schema/schemas";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@/lib/analytics";
import { useRef } from "react";
import { z } from "zod";
import { Input } from "../../input";
import { Textarea } from "../../textarea";
import { Button } from "../../button";
import { useToast } from "@/hooks/use-toast";
import { ErrorLine } from "../../ErrorLines";
import { useTranslation } from "next-i18next";

export type EmailInputs = z.infer<typeof ContactFormSchema>;

function ContactForm() {
  const { t } = useTranslation("contacts");
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailInputs>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      message: "",
      email: "",
    },
  });

  const started = useRef(false);

  const onSubmitHandler: SubmitHandler<EmailInputs> = async (data) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ message: data }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Contact API responded ${response.status}`);
      track("Tech: Contact form sent");
      toast({ title: "Thanks for reaching out!! We will revert soon" });
      reset();
    } catch (e) {
      track("Tech: Contact form failed");
      toast({ title: "Something went wrong, will comeback soon" });
      console.log("Error", e);
    }
  };

  return (
    <section className="relative isolate" data-tour="contact-form">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        onFocusCapture={() => {
          if (started.current) return;
          started.current = true;
          track("Tech: Contact form started");
        }}
        noValidate
        className="lg:flex-auto"
      >
        <div className="flex flex-col gap-6">
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Enter your Name"
          ></Input>
          {errors.name?.message && (
            <ErrorLine message={errors.name.message}></ErrorLine>
          )}
          <Input
            id="email"
            type="text"
            {...register("email")}
            placeholder="Enter your Email"
          ></Input>
          {errors.email?.message && (
            <ErrorLine message={errors.email.message}></ErrorLine>
          )}
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Your Message"
          ></Textarea>
          {errors.message?.message && (
            <ErrorLine message={errors.message.message}></ErrorLine>
          )}
          <Button disabled={isSubmitting} id="submit-bt" type="submit">
            {t("contactMe")}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
