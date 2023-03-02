import { ComponentPropsWithRef, PropsWithChildren } from "react";
import "./pill.scss";

interface Props extends PropsWithChildren<ComponentPropsWithRef<"span">> {
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "right" | "left";
}

const Pill = (props: Props) => {
  const { label, icon, iconPosition, className, ...restProps } = props;
  const classes = ["pill", className];

  return (
    <span className={classes.join(" ")} {...restProps}>
      {iconPosition === "left" && icon}
      <span>{label}</span>
      {iconPosition === "right" && icon}
    </span>
  );
};

export default Pill;
