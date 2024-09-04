import React from "react";
import styles from "src/components/Button.module.css";

/**
 * An interface defines the shape of an object (what fields are expected to exist and their types):
 * https://www.typescriptlang.org/docs/handbook/2/objects.html.
 *
 * We can use interfaces to specify the types of a component's props. For this `Button` component,
 * we require a string prop `label` and an optional prop `kind` which is restricted to two possible
 * string values: "primary" or "secondary". The interface also extends another interface,
 * `React.ComponentProps<"button">`, which comes from React and means that we also want to allow
 * all the props that a regular `<button>` component can receive (such as `onPress`). This is only
 * really useful for super basic "atom" components---most higher-level ones should have a pretty
 * limited, explicitly defined set of props.
 */
export interface ButtonProps extends React.ComponentProps<"button"> {
  label: string;
  kind?: "primary" | "secondary";
}

/**
 * This `Button` is pretty straightforward, besides the use of `React.forwardRef`. A ref is a way to
 * store a reference to a component so you can do things with it in effects and other special cases
 * (see https://react.dev/learn/manipulating-the-dom-with-refs). All built-in React components
 * can accept refs, but components that we write cannot unless we use this `forwardRef` function.
 * It wraps around the regular functional component and provides us with the `ref` argument which we
 * pass along to the actual `<button>` element. If a developer chooses to use a ref on our `Button`,
 * then it works as if it's on the `<button>` itself. If they don't use a ref, then nothing special
 * happens.
 *
 * Also, note that we pass all the rest of the props (`...props`, called "rest parameter syntax") to
 * the `<button>`. Thus our `Button` component works mostly like a standard `<button>` element, but
 * with our own styling and restrictions on what can be put inside of it.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, kind = "primary", className, ...props },
  ref,
) {
  let buttonClass = styles.button;
  switch (kind) {
    case "primary":
      buttonClass += ` ${styles.primary}`;
      break;
    case "secondary":
      buttonClass += ` ${styles.secondary}`;
      break;
  }
  if (className) {
    buttonClass += ` ${className}`;
  }
  return (
    <button ref={ref} className={buttonClass} {...props}>
      {label}
    </button>
  );
});
