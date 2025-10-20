import { GradientText } from "@/components/gradient-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (user) throw redirect({ to: "/" });

    return {
      user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex size-full items-center justify-center">
      <img
        src="/images/login-backdrop.png"
        className="size-[calc(100%+2rem)] object-cover blur-xs fixed -inset-4 -z-30 -rotate-y-12 skew-y-6 rotate-x-12 scale-125"
      />
      <div className="size-full absolute inset-0 -z-10 bg-gradient-to-br from-background/75 to-background/50"></div>
      <Link className="absolute top-4 left-4 " to="/">
        <GradientText>
          <span className="text-2xl font-black ">watchd.</span>
        </GradientText>
      </Link>
      <Card className="min-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    authClient.signIn.social({
                      provider: "google",
                    });
                  }}
                >
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
