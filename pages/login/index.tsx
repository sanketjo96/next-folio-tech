import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormSchema } from "@/lib/schema/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorLine } from "@/components/ui/ErrorLines";

export type LoginInputs = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const handleLoginSubmit: SubmitHandler<LoginInputs> = async (
    data: LoginInputs
  ) => {
    const { email, password } = data;
    const response = await fetch("/api/auth2/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/dashboard");
    } else {
      // Handle errors
    }
  };

  return (
    <section className="container max-w-3xl mt-16">
      <form onSubmit={handleSubmit(handleLoginSubmit)}>
        <div className="flex flex-col gap-3">
          <Input
            className="dark:border-orange-600"
            id="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email?.message && (
            <ErrorLine message={errors.email.message} />
          )}
          <Input
            className="dark:border-orange-600"
            type="password"
            id="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password?.message && (
            <ErrorLine message={errors.password.message} />
          )}
          <Button
            disabled={isSubmitting}
            className="max-w-[200] self-center"
            type="submit"
          >
            Login
          </Button>
        </div>
      </form>
    </section>
  );
}
