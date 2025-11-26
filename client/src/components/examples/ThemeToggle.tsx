import { ThemeProvider } from "../ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Theme Toggle</h3>
          <ThemeToggle />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the button to switch between light and dark modes
        </p>
      </div>
    </ThemeProvider>
  );
}
