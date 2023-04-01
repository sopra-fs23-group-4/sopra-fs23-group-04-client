import { createStyles } from "@mantine/core";
import React from "react";

export const Background = () => {
    const { classes } = useStyles();

    return <div className={classes.root}></div>;
};

export const useStyles = createStyles(() => ({
    root: {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        overflow: "hidden",
        zIndex: -1,
        background: "linear-gradient(rgb(0 128 128) 0%, rgb(32 178 170) 100%)", // top left to bottom
        transition: "all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
        "&:before": {
            content: '""',
            opacity: 0.7,
            width: "140%",
            height: "140%",
            position: "absolute",
            top: "-30%",
            right: "-50%",
            background: "radial-gradient(at center center, rgb(0 0 205) 0%, rgba(30, 144, 255, 0) 64%)", // top right
        },
        "&:after": {
            content: '""',
            opacity: 0.5,
            width: "150%",
            height: "150%",
            position: "absolute",
            bottom: "-65%",
            left: "-20%",
            background: "radial-gradient(at center center, rgb(0 0 128) 0%, rgba(247, 237, 225, 0) 70%)",
            transform: "rotate(30deg)",
        },
    },
}));
