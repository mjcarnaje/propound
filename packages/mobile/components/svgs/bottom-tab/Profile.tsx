import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const SvgProfile = (props: SvgProps) => (
  <Svg
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.125.094C5.238.094.469 4.864.469 10.75c0 5.887 4.77 10.656 10.656 10.656 5.887 0 10.656-4.77 10.656-10.656 0-5.887-4.77-10.656-10.656-10.656Zm0 4.125c2.063 0 3.781 1.718 3.781 3.781a3.787 3.787 0 0 1-3.781 3.781A3.76 3.76 0 0 1 7.344 8a3.787 3.787 0 0 1 3.781-3.781Zm0 14.781c-2.535 0-4.813-1.117-6.316-2.922.816-1.504 2.406-2.578 4.253-2.578.086 0 .172.043.301.086a5.82 5.82 0 0 0 1.762.258 5.54 5.54 0 0 0 1.719-.258c.129-.043.215-.086.344-.086 1.804 0 3.394 1.074 4.21 2.578A8.159 8.159 0 0 1 11.125 19Z"
      fill="currentColor"
    />
  </Svg>
);
export default SvgProfile;
