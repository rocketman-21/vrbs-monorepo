interface Props {
  title: string;
}

export const ResidencyBadge = (props: Props) => {
  const { title } = props;

  const label = getResidentLabel(title);
  if (!label) return null;

  const colors = getResidentColorClassNames(label);

  return (
    <span
      className={`rounded-md px-2 py-0.5 text-xs font-medium ${colors} max-w-48 truncate tracking-tighter`}
    >
      {label}
    </span>
  );
};

function getResidentColorClassNames(label: ReturnType<typeof getResidentLabel>) {
  switch (label) {
    case "Animator":
      return "bg-yellow-200 text-yellow-900";
    case "Illustrator":
      return "bg-rose-200 text-rose-950";
    case "Pixel Artist":
      return "bg-fuchsia-200 text-fuchsia-950";
    case "Street Artist":
      return "bg-blue-200 text-blue-950";
    case "Help those in need":
      return "bg-fuchsia-200 text-fuchsia-950";
    case "Improve public space":
      return "bg-lime-200 text-lime-950";
    case "Communications":
      return "bg-blue-200 text-blue-950";
  }
}

export function getResidentLabel(title: string) {
  switch (title) {
    case "Animators Residency":
      return "Animator";
    case "Pixel Artist Residency":
      return "Pixel Artist";
    case "Illustrators Residency":
      return "Illustrator";
    case "Street Artist Residency":
      return "Street Artist";
    case "Improve public spaces":
    case "Beach Cleaning @local site":
    case "Public gardens":
    case "Paramaribo Skate Park reVrbishment":
      return "Improve public space";
    case "Help those in need":
    case "Help people in need":
      return "Help those in need";
    case "Run Vrbs account on X":
    case "Run Vrbs social accounts":
      return "Communications";
    default:
      return undefined;
  }
}
