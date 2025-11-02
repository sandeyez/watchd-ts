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

export const Route = createFileRoute("/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  function handleSignup() {
    try {
      authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Sign up using your Google account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Button variant="outline" type="button" onClick={handleSignup}>
              <img
                src="/images/google-logo.svg"
                alt="Google Logo"
                className="size-4"
              />
              Sign up with Google
            </Button>
            <FieldDescription className="text-center">
              Already have an account? <Link to={"/login"}>Log in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
