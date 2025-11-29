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
import { LogIn, Loader, GraduationCap, BookOpen, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type LoginModalProps = {
  open: boolean;
  onLoginSuccess: (user: { id: string; username: string; role: string }) => void;
};

type UserRole = "student" | "lecturer" | "principal";

interface RoleCredentials {
  username: string;
  password: string;
  label: string;
  hint: string;
}

const roleCredentials: Record<UserRole, RoleCredentials> = {
  student: {
    username: "1RN21CS001",
    password: "student123",
    label: "Registration Number",
    hint: "Demo: 1RN21CS001 / student123",
  },
  lecturer: {
    username: "RNSIT0001",
    password: "lecturer123",
    label: "Employee ID",
    hint: "Demo: RNSIT0001 / lecturer123",
  },
  principal: {
    username: "PRINCIPAL001",
    password: "principal123",
    label: "Principal ID",
    hint: "Demo: PRINCIPAL001 / principal123",
  },
};

export function LoginModal({ open, onLoginSuccess }: LoginModalProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [username, setUsername] = useState(roleCredentials.student.username);
  const [password, setPassword] = useState(roleCredentials.student.password);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setUsername(roleCredentials[role].username);
    setPassword(roleCredentials[role].password);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter credentials",
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
        description: "Invalid credentials. Check the demo credentials below.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md border-0 shadow-2xl"
        data-testid="dialog-login"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="relative -m-6 mb-0 rounded-t-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CampusConnect</h1>
              <p className="text-sm text-white/80">RNSIT Kengeri</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <DialogTitle className="text-xl">Sign In</DialogTitle>
          <DialogDescription className="text-sm">
            Select your role and login to access campus resources
          </DialogDescription>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleRoleChange("student")}
              disabled={isLoading}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedRole === "student"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              data-testid="button-role-student"
            >
              <GraduationCap className="h-5 w-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">Student</p>
            </button>

            <button
              onClick={() => handleRoleChange("lecturer")}
              disabled={isLoading}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedRole === "lecturer"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              data-testid="button-role-lecturer"
            >
              <BookOpen className="h-5 w-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">Lecturer</p>
            </button>

            <button
              onClick={() => handleRoleChange("principal")}
              disabled={isLoading}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedRole === "principal"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              data-testid="button-role-principal"
            >
              <Crown className="h-5 w-5 mx-auto mb-1.5" />
              <p className="text-sm font-medium">Principal</p>
            </button>
          </div>

          {/* Login Form */}
          <div className="space-y-3.5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {roleCredentials[selectedRole].label}
              </label>
              <Input
                placeholder="Enter your ID"
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

            {/* Demo Credentials - Only for Principal and Lecturer */}
            {(selectedRole === "principal" || selectedRole === "lecturer") && (
              <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
                <p className="text-xs font-medium text-foreground mb-1.5">
                  Demo Credentials
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {roleCredentials[selectedRole].hint}
                </p>
              </div>
            )}
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-10 font-semibold"
            data-testid="button-login"
          >
            {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
