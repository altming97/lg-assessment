import { ComponentPropsWithRef, PropsWithChildren } from "react";
import "./button.scss";

interface Props extends PropsWithChildren<ComponentPropsWithRef<"button">> {
  label?: string;
  pill?: boolean;
}

const Button = (props: Props) => {
  const { label, pill, className, ...restProps } = props;
  const classes = ["btn", ...(pill ? ["rounded"] : []), className];

  return (
    <button className={classes.join(" ")} {...restProps}>
      {label ?? ""}
    </button>
  );
};

export default Button;
