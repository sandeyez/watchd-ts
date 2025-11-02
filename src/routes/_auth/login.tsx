import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  async function handleLogin() {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Use your Google account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Button variant="outline" type="button" onClick={handleLogin}>
              <img
                src="/images/google-logo.svg"
                alt="Google Logo"
                className="size-4"
              />
              Login with Google
            </Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account? <Link to={"/signup"}>Sign up</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
