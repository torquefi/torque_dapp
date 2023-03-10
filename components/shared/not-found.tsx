interface PropsType extends ReactProps {
  icon?: JSX.Element;
  text: string;
  iconClassName?: string;
}
export function NotFound({ iconClassName = "text-2xl mb-2", ...props }: PropsType) {
  return (
    <div
      className={`w-full flex-center flex-col text-center text-gray-500 py-12 font-semibold ${
        props.className || ""
      }`}
    >
      {props.icon && <i className={`${iconClassName}`}>{props.icon}</i>}
      <span>{props.text || "Không tìm thấy"}</span>
      {props.children}
    </div>
  );
}
