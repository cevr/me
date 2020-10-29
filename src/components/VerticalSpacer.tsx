interface VerticalSpacerProps {
  size?: "sm" | "md" | "lg";
}

let sizes = {
  sm: "0.5rem 0",
  md: "1rem 0",
  lg: "1.5rem 0",
};

function VerticalSpacer({ size = "md" }: VerticalSpacerProps) {
  return (
    <div
      style={{
        margin: sizes[size],
      }}
    />
  );
}

export default VerticalSpacer;
