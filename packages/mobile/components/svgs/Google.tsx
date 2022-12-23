import * as React from "react";
import Svg, { SvgProps, Rect, Path } from "react-native-svg";
const SvgGoogle = (props: SvgProps) => (
  <Svg
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={38} height={38} rx={1} fill="#fff" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.208 19.194c0-.606-.054-1.189-.155-1.748H19v3.307h4.602a3.934 3.934 0 0 1-1.707 2.58v2.146h2.764c1.616-1.489 2.549-3.68 2.549-6.285Z"
      fill="#4285F4"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 27.55c2.308 0 4.244-.766 5.659-2.071l-2.764-2.146c-.765.513-1.745.816-2.895.816-2.227 0-4.112-1.504-4.784-3.524h-2.857v2.215A8.547 8.547 0 0 0 19 27.55Z"
      fill="#34A853"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.216 20.625A5.14 5.14 0 0 1 13.948 19c0-.564.097-1.111.268-1.625V15.16h-2.857A8.546 8.546 0 0 0 10.45 19c0 1.38.33 2.686.91 3.84l2.856-2.215Z"
      fill="#FBBC05"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 13.85c1.255 0 2.382.432 3.268 1.28l2.453-2.453C23.24 11.297 21.305 10.45 19 10.45a8.547 8.547 0 0 0-7.64 4.71l2.856 2.215c.672-2.02 2.557-3.524 4.784-3.524Z"
      fill="#EA4335"
    />
  </Svg>
);
export default SvgGoogle;
