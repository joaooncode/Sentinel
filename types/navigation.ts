import type { ImageSourcePropType } from "react-native";

export interface AppTab {
  name: string;
  title: string;
  icon: ImageSourcePropType;
}

export interface TabIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
}
