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
import { Loader } from "lucide-react";
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

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter username and password",
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
        title: "Welcome!",
        description: `Logged in as ${user.username}`,
      });
      onLoginSuccess(user);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter username and password",
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

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        data-testid="dialog-login"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to CampusConnect</DialogTitle>
          <DialogDescription>
            Sign in or create a new account to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              data-testid="input-username"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              data-testid="input-password"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Demo: username: <strong>student</strong> password: <strong>password</strong>
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1"
              data-testid="button-login"
            >
              {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              Login
            </Button>
            <Button
              onClick={handleSignup}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
              data-testid="button-signup"
            >
              {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
