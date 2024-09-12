import { User } from "@/components/context/UserContext";
import { useLoggedInUser } from "@/components/providers/UserProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { user, setUser } = useLoggedInUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user as User);
        }
      } catch (e) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  if (!user) router.push("/");

  return (
    <div className="container max-w-3xl">
      <h1>
        Hello, <span className="font-bold">{user?.email}</span>
      </h1>
    </div>
  );
}
