import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import { ChartBar as ChartBarIcon } from "../../icons/chart-bar";
import { ShoppingBag as ShoppingBagIcon } from "../../icons/shopping-bag";
import { User as UserIcon } from "../../icons/user";
import { NavItem } from "../navbar/nav-item";
import Image from "next/image";
import { Theme } from "@mui/system";

const items = [
  {
    href: "/register",
    icon: <ShoppingBagIcon fontSize="small" />,
    title: "Register",
  },
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/account",
    icon: <UserIcon fontSize="small" />,
    title: "Account",
  },
];

interface DashboardSidebarProps {
  open: boolean;
  solid: boolean;
  onClose: any;
}

export const DashboardSidebar = ({ open, solid, onClose }: DashboardSidebarProps) => {
  const router = useRouter();

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#535353",
        width: "280px"
      }}
    >
      <div>
        <Box sx={{ m: 2 }}>
          <NextLink href="/" passHref>
            <a>
              <Image
                width="100%"
                height="100%"
                src="/static/logo.svg"
                style={{ padding: 0 }}
                alt={""}
              />
            </a>
          </NextLink>
        </Box>
      </div>
      <Divider
        sx={{
          borderColor: "#2D3748",
          my: 3,
          marginTop: "0px",
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        {items.map((item) => (
          <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
        ))}
      </Box>
    </Box>
  );

  if (solid) {
    return (
      <div style={{
        backgroundColor: "neutral.900",
        color: "#FFFFFF",
        width: 280,
      }}>
        {content}
      </div>
    );
  }

  if (open) {
    return (
      <div style={{
        backgroundColor: "neutral.900",
        color: "#FFFFFF",
        width: "280px",
        position: "fixed",
        height: "100%",
        zIndex: 5000
      }}>
        {content}
      </div>
    )
  }

  return (<></>);
}