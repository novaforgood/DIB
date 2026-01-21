import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent you a confirmation link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please check your inbox and click the link to complete your registration.
            </p>
            <Link to="/login" className="text-sm underline underline-offset-4">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
