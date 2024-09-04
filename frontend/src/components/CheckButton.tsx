import React from "react";
import styles from "src/components/CheckButton.module.css";

export interface CheckButtonProps {
  checked: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * See `src/components/Button.tsx` for an explanation of `React.forwardRef`.
 * This component uses two SVG images to display the checked/unchecked icons.
 * Both come from the `public` folder--thanks to Create React App, anything in
 * that folder is automatically made available as a public file, so it's a good
 * place to store static icons and images. (You can also view the icons directly
 * in your browser by visiting, say, `localhost:3000/checkButton.checked.svg`.)
 */
export const CheckButton = React.forwardRef<HTMLButtonElement, CheckButtonProps>(
  function CheckButton({ checked, disabled, onPress, className }: CheckButtonProps, ref) {
    let buttonClass = styles.button;
    if (className) {
      buttonClass += ` ${className}`;
    }
    return (
      <button ref={ref} disabled={disabled} onClick={onPress} className={buttonClass}>
        <img
          src={checked ? "/checkButton.checked.svg" : "/checkButton.unchecked.svg"}
          alt=""
          width={28}
          height={28}
        />
      </button>
    );
  },
);
