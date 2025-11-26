import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Loader, GraduationCap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type LoginModalProps = {
  open: boolean;
  onLoginSuccess: (user: { id: string; username: string }) => void;
};

export function LoginModal({ open, onLoginSuccess }: LoginModalProps) {
  const { toast } = useToast();
  const [username, setUsername] = useState("student");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });
      const user = await res.json();
      toast({
        title: "Welcome Back!",
        description: `Logged in as ${user.username}`,
      });
      onLoginSuccess(user);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Try: student / password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/signup", {
        username,
        password,
      });
      const user = await res.json();
      toast({
        title: "Account Created!",
        description: `Welcome ${user.username}`,
      });
      onLoginSuccess(user);
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Username may already exist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      isSignUp ? handleSignup() : handleLogin();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md border-0 shadow-2xl"
        data-testid="dialog-login"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header with gradient background */}
        <div className="relative -m-6 mb-0 rounded-t-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CampusConnect</h1>
              <p className="text-sm text-white/80">Campus Hub</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <DialogTitle className="text-xl">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isSignUp
              ? "Join CampusConnect to access campus resources"
              : "Sign in to your account to continue"}
          </DialogDescription>
        </div>

        {/* Form */}
        <div className="space-y-3.5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Username
            </label>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              onKeyPress={handleKeyPress}
              data-testid="input-username"
              className="h-10"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyPress={handleKeyPress}
              data-testid="input-password"
              className="h-10"
            />
          </div>

          {!isSignUp && (
            <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
              <p className="text-xs font-medium text-foreground mb-1.5">
                Demo Account
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="text-foreground font-medium">Username:</span>{" "}
                  student
                </div>
                <div>
                  <span className="text-foreground font-medium">Password:</span>{" "}
                  password
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={isSignUp ? handleSignup : handleLogin}
            disabled={isLoading}
            className="flex-1 h-10 font-semibold"
            data-testid={isSignUp ? "button-signup" : "button-login"}
          >
            {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
            {isSignUp ? (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
            variant="outline"
            className="flex-1 h-10 font-semibold"
          >
            {isSignUp ? "Back to Login" : "Create Account"}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {isSignUp
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
