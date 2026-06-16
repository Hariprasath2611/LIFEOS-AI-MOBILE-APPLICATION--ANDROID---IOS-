import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ChartProps {
  data: number[];
  labels: string[];
  type?: 'line' | 'bar' | 'heatmap';
  title?: string;
}

export const CustomChart: React.FC<ChartProps> = ({
  data = [10, 25, 45, 30, 75, 80, 95],
  labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  type = 'line',
  title
}) => {
  const screenWidth = Dimensions.get('window').width - 48; // Padding adjustment
  const height = 160;
  const padding = 24;
  
  const chartHeight = height - padding * 2;
  const chartWidth = screenWidth - padding * 2;
  
  const maxVal = Math.max(...data, 10);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal;

  // Calculate coordinates for line chart
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = height - padding - ((val - minVal) / range) * chartHeight;
    return { x, y, value: val };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <View className="bg-card border border-glassBorder rounded-2xl p-4 mb-4" style={{ backgroundColor: '#111111' }}>
      {title && <Text className="text-white text-base font-semibold mb-3">{title}</Text>}

      {type === 'line' && (
        <View>
          <Svg width={screenWidth} height={height}>
            <Defs>
              <LinearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#00FF88" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#00FF88" stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            
            {/* Grid Lines */}
            <Line x1={padding} y1={padding} x2={screenWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <Line x1={padding} y1={padding + chartHeight / 2} x2={screenWidth - padding} y2={padding + chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <Line x1={padding} y1={height - padding} x2={screenWidth - padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

            {/* Filled Area */}
            {points.length > 0 && (
              <Path d={areaD} fill="url(#glowGrad)" />
            )}

            {/* Core Line */}
            {points.length > 0 && (
              <Path
                d={pathD}
                fill="none"
                stroke="#00FF88"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Data Circles */}
            {points.map((p, idx) => (
              <Circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#0A0A0A"
                stroke="#00FF88"
                strokeWidth="2"
              />
            ))}
          </Svg>

          {/* Labels Row */}
          <View className="flex-row justify-between px-6 mt-1">
            {labels.map((lbl, index) => (
              <Text key={index} className="text-mutedText text-xs font-medium">{lbl}</Text>
            ))}
          </View>
        </View>
      )}

      {type === 'bar' && (
        <View>
          <Svg width={screenWidth} height={height}>
            <Defs>
              <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#00FF88" stopOpacity="1" />
                <Stop offset="100%" stopColor="#00C853" stopOpacity="0.6" />
              </LinearGradient>
            </Defs>
            
            {/* Grid Lines */}
            <Line x1={padding} y1={height - padding} x2={screenWidth - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Render Bars */}
            {data.map((val, idx) => {
              const numBars = data.length || 1;
              const barWidth = Math.max(12, (chartWidth / numBars) - 12);
              const x = padding + (idx / numBars) * chartWidth + (chartWidth / numBars - barWidth) / 2;
              const barHeight = (val / maxVal) * chartHeight;
              const y = height - padding - barHeight;

              return (
                <Rect
                  key={idx}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(4, barHeight)}
                  rx="4"
                  fill="url(#barGrad)"
                />
              );
            })}
          </Svg>

          {/* Labels Row */}
          <View className="flex-row justify-between px-6 mt-1">
            {labels.map((lbl, index) => (
              <Text key={index} className="text-mutedText text-xs font-medium">{lbl}</Text>
            ))}
          </View>
        </View>
      )}

      {type === 'heatmap' && (
        <View className="items-center py-2">
          {/* Calendar style square grids layout */}
          <View className="flex-row flex-wrap justify-center" style={{ width: chartWidth }}>
            {Array.from({ length: 28 }).map((_, idx) => {
              // Mock heatmap frequencies (colors from dark gray to bright emerald green)
              const intensity = (idx % 4 === 0) ? 0 : (idx % 3 === 0) ? 3 : (idx % 5 === 0) ? 2 : 1;
              const fillColors = ['rgba(255,255,255,0.03)', '#00331b', '#007f44', '#00ff88'];
              return (
                <View
                  key={idx}
                  className="w-5 h-5 m-1 rounded-sm border border-glassBorder"
                  style={{
                    backgroundColor: fillColors[intensity],
                  }}
                />
              );
            })}
          </View>
          <Text className="text-mutedText text-xs mt-3">Habit Completion Density (Last 4 Weeks)</Text>
        </View>
      )}
    </View>
  );
};
