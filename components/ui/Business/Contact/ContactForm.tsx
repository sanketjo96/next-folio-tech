import { ContactFormSchema } from "@/lib/schema/schemas";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../input";
import { Textarea } from "../../textarea";
import { Button } from "../../button";
import { useToast } from "@/hooks/use-toast";

export type EmailInputs = z.infer<typeof ContactFormSchema>;

const ErrorLine = ({ message }: { message: string }) => (
  <p className="ml-1 mt-2 text-sm text-rose-400">{message}</p>
);

function ContactForm() {
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

  const onSubmitHandler: SubmitHandler<EmailInputs> = async (data) => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ message: data }),
        headers: {
          "Content-type": "application/json",
        },
      });
      toast({ title: "Thanks for reaching out!! We will revert soon" });
    } catch (e) {
      toast({ title: "Something went wrong, will comeback soon" });
      console.log("Error", e);
    } finally {
      reset();
    }
  };

  return (
    <section className="relative isolate">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        className="mt-8 lg:flex-auto"
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
            Contact Me
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
