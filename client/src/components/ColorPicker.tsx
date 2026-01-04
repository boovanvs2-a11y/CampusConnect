import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";

type ColorOption = {
  name: string;
  hue: number;
  saturation: number;
  lightness: number;
  dark?: { hue: number; saturation: number; lightness: number };
};

const COLORS: ColorOption[] = [
  {
    name: "Cyan",
    hue: 188,
    saturation: 97,
    lightness: 35,
    dark: { hue: 188, saturation: 97, lightness: 50 },
  },
  {
    name: "Green",
    hue: 142,
    saturation: 76,
    lightness: 36,
    dark: { hue: 142, saturation: 76, lightness: 56 },
  },
  {
    name: "Red",
    hue: 0,
    saturation: 84,
    lightness: 42,
    dark: { hue: 0, saturation: 84, lightness: 62 },
  },
  {
    name: "Blue",
    hue: 217,
    saturation: 91,
    lightness: 40,
    dark: { hue: 217, saturation: 91, lightness: 60 },
  },
  {
    name: "Purple",
    hue: 280,
    saturation: 85,
    lightness: 40,
    dark: { hue: 280, saturation: 85, lightness: 60 },
  },
  {
    name: "Orange",
    hue: 28,
    saturation: 85,
    lightness: 52,
    dark: { hue: 28, saturation: 85, lightness: 48 },
  },
  {
    name: "Pink",
    hue: 340,
    saturation: 82,
    lightness: 52,
    dark: { hue: 340, saturation: 82, lightness: 72 },
  },
  {
    name: "Gray",
    hue: 0,
    saturation: 0,
    lightness: 50,
    dark: { hue: 0, saturation: 0, lightness: 60 },
  },
];

export function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLORS[0]);

  useEffect(() => {
    // Load saved color from localStorage
    const saved = localStorage.getItem("campus-secondary-color");
    if (saved) {
      const color = COLORS.find((c) => c.name === saved);
      if (color) {
        setSelectedColor(color);
        applyColor(color);
      }
    } else {
      applyColor(COLORS[0]);
    }
  }, []);

  const applyColor = (color: ColorOption) => {
    const isDark = document.documentElement.classList.contains("dark");
    const colorToApply = isDark && color.dark ? color.dark : color;

    // Update CSS variables for primary, secondary, accent colors
    document.documentElement.style.setProperty("--primary", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);
    document.documentElement.style.setProperty("--sidebar-primary", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);
    document.documentElement.style.setProperty("--sidebar-ring", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);
    document.documentElement.style.setProperty("--ring", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);
    
    // Update all section accent colors to match the selected theme
    document.documentElement.style.setProperty("--announcement-accent", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);
    document.documentElement.style.setProperty("--discussion-accent", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);
    document.documentElement.style.setProperty("--event-accent", `${colorToApply.hue} ${colorToApply.saturation}% ${colorToApply.lightness}%`);

    // Update accent color with adjusted values (more subtle)
    const accentLight = colorToApply.lightness + 50;
    document.documentElement.style.setProperty("--accent", `${colorToApply.hue} 15% ${Math.min(85, accentLight)}%`);
  };

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    localStorage.setItem("campus-secondary-color", color.name);
    applyColor(color);
  };

  // Listen for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      applyColor(selectedColor);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [selectedColor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-color-picker"
          title={`Secondary Color: ${selectedColor.name}`}
        >
          <div className="flex items-center gap-1.5">
            <Palette className="h-5 w-5" />
            <div
              className="h-3 w-3 aspect-square rounded-full border border-foreground/30 flex-shrink-0"
              style={{
                backgroundColor: `hsl(${selectedColor.hue} ${selectedColor.saturation}% ${selectedColor.lightness}%)`,
              }}
            />
          </div>
          <span className="sr-only">Change secondary color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="grid grid-cols-2 gap-2 p-2">
          {COLORS.map((color) => (
            <DropdownMenuItem
              key={color.name}
              onClick={() => handleColorSelect(color)}
              className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-accent"
            >
              <div
                className={`h-4 w-4 aspect-square rounded-full border-2 flex-shrink-0 ${
                  selectedColor.name === color.name ? "border-foreground" : "border-muted"
                }`}
                style={{
                  backgroundColor: `hsl(${color.hue} ${color.saturation}% ${color.lightness}%)`,
                }}
              />
              <span className="text-sm">{color.name}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
