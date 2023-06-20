import styled from "@emotion/styled";
import {
  Drawer as MUIDrawer,
  Box,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const DesktopDrawer = styled(MUIDrawer)(({ width }) => ({
  width,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width,
    top: "64px",
    height: "calc(100% - 64px)"
  }
}));

const MobileDrawer = styled(MUIDrawer)(() => ({
  width: "75vw",
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: "75vw"
  }
}));

const CollapsibleToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: "center",
  borderTop: `1px solid ${theme.palette.divider}`
}));

const Drawer = ({ children, width, collapsed, toggleCollapsed, ...props }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const CustomDrawer = isDesktop ? DesktopDrawer : MobileDrawer;

  return (
    <CustomDrawer
      {...props}
      desktop={isDesktop ? isDesktop.toString() : undefined}
      width={width}
      variant={isDesktop ? "permanent" : "temporary"}
      anchor={isDesktop ? "left" : "right"}
    >
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "auto" }}>
        {children}
      </Box>
      {isDesktop && (
        <CollapsibleToolbar width={width}>
          <IconButton onClick={toggleCollapsed}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </CollapsibleToolbar>
      )}
    </CustomDrawer>
  );
};

export default Drawer;