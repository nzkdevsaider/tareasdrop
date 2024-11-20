import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { $CONST } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import OnboardingPage from "@/components/OnboardingPage";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect($CONST.routes.signIn);
  }

  return <OnboardingPage />;
}
