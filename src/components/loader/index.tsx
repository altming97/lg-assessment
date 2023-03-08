interface Props {
  label?: string;
}

const Loader = (props: Props) => {
  return (
    <div className="loader">{props.label ? props.label : "Loading..."}</div>
  );
};

export default Loader;
