import { useMediaQuery, useTheme, Pagination } from "@mui/material";

interface Props {
  page: number;
  setPage: (page: number) => void;
}
export default function PaginationBar({ page, setPage }: Props) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("md"));

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
      page={page}
      onChange={(_, newPage: number) => setPage(newPage)}
    />
  );
}
