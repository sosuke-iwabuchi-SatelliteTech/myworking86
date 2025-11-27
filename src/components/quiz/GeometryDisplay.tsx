import { GeometryData } from '../../types';

interface GeometryDisplayProps {
    geometry: GeometryData;
}

/**
 * 図形問題のSVG画像を表示するコンポーネント。
 */
export default function GeometryDisplay({ geometry }: GeometryDisplayProps) {
    const { shape, dimensions } = geometry;
    const viewBoxWidth = 300;
    const viewBoxHeight = 220;

    let logicWidth = 0;
    let logicHeight = 0;

    if (shape === 'rectangle') {
        logicWidth = dimensions.width!;
        logicHeight = dimensions.height!;
    } else if (shape === 'triangle') {
        logicWidth = dimensions.width!;
        logicHeight = dimensions.height!;
    } else if (shape === 'trapezoid') {
        logicWidth = Math.max(dimensions.width!, dimensions.upper || 0);
        logicHeight = dimensions.height!;
    }

    const paddingLeft = 60;
    const paddingRight = 30;
    const paddingTop = 40;
    const paddingBottom = 40;

    const availableWidth = viewBoxWidth - (paddingLeft + paddingRight);
    const availableHeight = viewBoxHeight - (paddingTop + paddingBottom);

    const scaleX = availableWidth / logicWidth;
    const scaleY = availableHeight / logicHeight;
    const scale = Math.min(scaleX, scaleY);

    const cx = paddingLeft + availableWidth / 2;
    const cy = paddingTop + availableHeight / 2;

    const strokeColor = '#334155'; // slate-700
    const fillColor = '#e0f2fe'; // sky-100
    const labelColor = '#1e293b'; // slate-800

    let content;

    if (shape === 'rectangle') {
        const w = dimensions.width! * scale;
        const h = dimensions.height! * scale;
        const x = cx - w / 2;
        const y = cy - h / 2;

        content = (
            <>
                <rect x={x} y={y} width={w} height={h} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                <text x={cx} y={y + h + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.width}cm
                </text>
                <text x={x - 10} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.height}cm
                </text>
            </>
        );
    } else if (shape === 'triangle') {
        const w = dimensions.width! * scale;
        const h = dimensions.height! * scale;
        const xBase = cx - w / 2;
        const yBase = cy + h / 2;
        const xPeak = cx - w / 4;

        content = (
            <>
                <polygon points={`${xBase},${yBase} ${xBase + w},${yBase} ${xPeak},${yBase - h}`} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                <line x1={xPeak} y1={yBase} x2={xPeak} y2={yBase - h} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
                <polyline points={`${xPeak},${yBase} ${xPeak + 10},${yBase} ${xPeak + 10},${yBase - 10} ${xPeak},${yBase - 10}`} fill="none" stroke={strokeColor} strokeWidth="1" />
                <text x={cx} y={yBase + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.width}cm
                </text>
                <text x={xPeak - 5} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.height}cm
                </text>
            </>
        );
    } else if (shape === 'trapezoid') {
        const wBottom = dimensions.width! * scale;
        const wTop = dimensions.upper! * scale;
        const h = dimensions.height! * scale;
        const xBottomStart = cx - wBottom / 2;
        const yBottom = cy + h / 2;
        const xTopStart = cx - wTop / 2;
        const yTop = cy - h / 2;

        content = (
            <>
                <polygon points={`${xBottomStart},${yBottom} ${xBottomStart + wBottom},${yBottom} ${xTopStart + wTop},${yTop} ${xTopStart},${yTop}`} fill={fillColor} stroke={strokeColor} strokeWidth="3" />
                <line x1={xTopStart} y1={yTop} x2={xTopStart} y2={yBottom} stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" />
                <polyline points={`${xTopStart},${yBottom} ${xTopStart + 10},${yBottom} ${xTopStart + 10},${yBottom - 10} ${xTopStart},${yBottom - 10}`} fill="none" stroke={strokeColor} strokeWidth="1" />
                <text x={cx} y={yBottom + 20} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.width}cm
                </text>
                <text x={cx} y={yTop - 10} textAnchor="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.upper}cm
                </text>
                <text x={xTopStart - 5} y={cy} textAnchor="end" dominantBaseline="middle" fill={labelColor} fontSize="16" fontWeight="bold">
                    {dimensions.height}cm
                </text>
            </>
        );
    }

    return (
        <div className="flex justify-center mb-2">
            <svg width={viewBoxWidth} height={viewBoxHeight} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="bg-white rounded-xl">
                {content}
            </svg>
        </div>
    );
}
