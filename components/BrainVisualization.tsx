'use client';

const nodes = [
  { cx: 50, cy: 18, delay: '0s' },
  { cx: 85, cy: 35, delay: '0.5s' },
  { cx: 82, cy: 70, delay: '1s' },
  { cx: 50, cy: 85, delay: '1.5s' },
  { cx: 18, cy: 70, delay: '2s' },
  { cx: 15, cy: 35, delay: '2.5s' },
];

export default function BrainVisualization() {
  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-pulse/5 blur-3xl animate-pulse-glow" />

      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#c850c0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c850c0" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c850c0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Core glow */}
        <circle cx="50" cy="50" r="40" fill="url(#coreGlow)" />

        {/* Orbital ring 1 */}
        <ellipse
          cx="50"
          cy="50"
          rx="32"
          ry="32"
          fill="none"
          stroke="url(#ringGrad1)"
          strokeWidth="0.3"
          className="origin-center"
          style={{ animation: 'orbit 20s linear infinite' }}
        />

        {/* Orbital ring 2 (tilted via ellipse) */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="20"
          fill="none"
          stroke="url(#ringGrad2)"
          strokeWidth="0.3"
          className="origin-center"
          style={{ animation: 'orbit 25s linear infinite reverse' }}
        />

        {/* Orbital ring 3 */}
        <ellipse
          cx="50"
          cy="50"
          rx="22"
          ry="38"
          fill="none"
          stroke="url(#ringGrad1)"
          strokeWidth="0.2"
          opacity="0.5"
          className="origin-center"
          style={{ animation: 'orbit 30s linear infinite' }}
        />

        {/* Connection lines */}
        {nodes.map((node, i) => (
          <line
            key={`line-${i}`}
            x1="50"
            y1="50"
            x2={node.cx}
            y2={node.cy}
            stroke="#00d4ff"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}

        {/* Cross-connections between adjacent nodes */}
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <line
              key={`conn-${i}`}
              x1={node.cx}
              y1={node.cy}
              x2={next.cx}
              y2={next.cy}
              stroke="#c850c0"
              strokeWidth="0.1"
              opacity="0.2"
            />
          );
        })}

        {/* Center core */}
        <circle cx="50" cy="50" r="4" fill="#0a0a0f" />
        <circle cx="50" cy="50" r="3" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.8">
          <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="1.2" fill="#00d4ff" opacity="0.9" />

        {/* Floating nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.cx} cy={node.cy} r="1.5" fill="#0a0a0f" />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="1"
              fill={i % 2 === 0 ? '#00d4ff' : '#c850c0'}
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0.8;0.3;0.8"
                dur="2s"
                begin={node.delay}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="2.5"
              fill="none"
              stroke={i % 2 === 0 ? '#00d4ff' : '#c850c0'}
              strokeWidth="0.15"
              opacity="0.3"
            >
              <animate
                attributeName="r"
                values="2;3.5;2"
                dur="3s"
                begin={node.delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.05;0.3"
                dur="3s"
                begin={node.delay}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
