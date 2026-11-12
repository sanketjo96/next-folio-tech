import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormSchema } from "@/lib/schema/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorLine } from "@/components/ui/ErrorLines";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";

export type LoginInputs = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const { t } = useTranslation("common");
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

    const dataRes = await response.json();
    if (dataRes.success) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <NextSeo
        title="Sanket Joshi | Login | Showcasing React, Node.js, AWS Skills"
        canonical="https://www.techsanket.in/login"
      />
      <section className="container max-w-md mt-8">
        <form onSubmit={handleSubmit(handleLoginSubmit)}>
          <div className="surface mt-16 flex flex-col gap-3 p-8 sm:p-12">
            <Input
              id="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email?.message && (
              <ErrorLine message={errors.email.message} />
            )}
            <Input
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
              className="mt-2"
              type="submit"
            >
              {t("login")}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

