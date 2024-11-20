"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { $CONST } from "@/lib/constants";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}${$CONST.routes.auth}/callback`,
    },
  });

  if (error) {
    console.error(`${error.code} ${error.message}`);
    return encodedRedirect("error", $CONST.routes.signUp, error.message);
  }
  return encodedRedirect(
    "success",
    $CONST.routes.signUp,
    "Thanks for signing up! Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", $CONST.routes.signIn, error.message);
  }

  return redirect($CONST.routes.onboarding);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect(
      "error",
      $CONST.routes.forgotPassword,
      "Email is required"
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}${$CONST.routes.auth}/callback?redirect_to=${$CONST.routes.recover}`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      $CONST.routes.forgotPassword,
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    $CONST.routes.forgotPassword,
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      $CONST.routes.recover,
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", $CONST.routes.recover, "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", $CONST.routes.recover, "Password update failed");
  }

  encodedRedirect("success", $CONST.routes.recover, "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect($CONST.routes.signIn);
};

export const createTaskAction = async (
  title: string,
  description: string,
  reward: number,
  deadline: Date | undefined
) => {
  if (!title || !description || !reward || !deadline) {
    throw new Error("Todos los campos son requeridos.");
  }

  const supabase = createClient();
  const { error } = await supabase.from("tasks").insert([
    {
      title,
      description,
      budget: reward,
      deadline,
      //creator_id: (await supabase.auth.getUser()).data.user?.id,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  redirect($CONST.routes.tasks);
};
