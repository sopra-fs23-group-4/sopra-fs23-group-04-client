import React from "react";
import { Stack, Title } from "@mantine/core";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Header = () => (
    <div>
        <Stack align="center">
            <Title sx={{ color: "lightblue", padding: 5 }}>Stadt, Land, +</Title>
        </Stack>
    </div>
);

/**
 * Don't forget to export your component!
 */
export default Header;