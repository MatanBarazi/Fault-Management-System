import React from "react";
import { Link } from "react-router-dom";

import styles from "./Button.module.css";

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`${styles[`button button--`]}${props.size || "default"} ${
          props.inverse && styles["button--inverse"]
        } ${props.danger && styles["button--danger"]}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`${styles[`button button--`]}${props.size || "default"} ${
          props.inverse && styles["button--inverse"]
        } ${props.danger && styles["button--danger"]}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`${styles[`button`]} ${
        props.size && styles[`button--${props.size}`]
      } ${props.inverse && styles["button--inverse"]} ${
        props.danger && styles["button--danger"]
      } ${props.color && styles[`button--color--${props.color}`]} ${props.className}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
      title={props.title}
    >
      {props.children}
    </button>
  );
};

export default Button;
