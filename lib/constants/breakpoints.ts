// Reference for breakpoints used across the app
export const BREAKPOINTS = {
  sm: "640px", // Small devices (phones)
  md: "768px", // Medium devices (tablets)
  lg: "1024px", // Large devices (laptops)
  xl: "1280px", // Extra large devices
  "2xl": "1536px", // 2X Extra large devices
};

/*
Usage in components:
- sm: Small devices and up
- md: Medium devices and up
- lg: Large devices and up
- xl: Extra large devices and up
- 2xl: 2X Extra large devices

Common responsive patterns:

1. Font sizes:
text-base sm:text-lg md:text-xl

2. Padding/Margin:
p-4 sm:p-6 md:p-8 lg:p-10

3. Grid/Flex columns:
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4

4. Width:
w-full sm:w-auto md:max-w-2xl lg:max-w-4xl

5. Hiding/Showing elements:
hidden sm:block (Hide on mobile, show on sm and up)
sm:hidden (Show on mobile, hide on sm and up)

6. Container padding:
px-4 sm:px-6 lg:px-8

7. Flex direction:
flex-col sm:flex-row

8. Gap:
gap-4 sm:gap-6 md:gap-8

9. Image sizes:
w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
*/
