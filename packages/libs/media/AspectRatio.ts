export enum AspectRatioTypeEnum {
  "Horizontal" = "Horizontal",
  "Square" = "Square",
  "Vertical" = "Vertical",
}

export function getAspectRatioClass(aspectRatio: AspectRatioTypeEnum) {
  switch (aspectRatio) {
    case AspectRatioTypeEnum.Horizontal:
      return "aspect-video";
    case AspectRatioTypeEnum.Vertical:
      return "aspect-9/16";
    default:
      return "aspect-square";
  }
}
