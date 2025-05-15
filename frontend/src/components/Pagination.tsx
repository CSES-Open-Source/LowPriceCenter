import { useMediaQuery, useTheme, Pagination } from "@mui/material";

export default function PaginationBar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm")); // e.g. <600px
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md")); // e.g. 600–900px
  const isLgUp = useMediaQuery(theme.breakpoints.up("md")); // >900px

  let size: "small" | "medium" | "large" = "medium";
  let siblingCount = 1;

  if (isSm) {
    size = "small";
    siblingCount = 0;
  } else if (isMd) {
    size = "medium";
    siblingCount = 3;
  } else if (isLgUp) {
    size = "large";
    siblingCount = 5;
  }

  return (
    <Pagination
      count={30}
      color="primary"
      size={size}
      showFirstButton
      showLastButton
      siblingCount={siblingCount}
    />
  );
}
