/**
 * SVGのプロパティを受け取るためのインターフェース
 */
interface SvgProps {
  /**
   * SVG要素に適用するCSSクラス名
   */
  className?: string;
  /**
   * SVGの幅
   */
  width?: string | number;
  /**
   * SVGの高さ
   */
  height?: string | number;
}

/**
 * はてなマークのアイコンを表示するReactコンポーネント
 * @param {SvgProps} props - SVGのプロパティ
 */
export default function QuestionIcon({ className, width = 28, height = 28 }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}
