"use client";
import React from "react";

// Video component: fixed size container (width x height) that autoplay, loops and is muted.
// Props:
// - src: video URL (required)
// - poster: optional poster image
// - width, height: pixel dimensions (defaults: 330x610)
// - className: extra classes for wrapper
export default function Video({ src, poster, width = 330, height = 610, className = "" }) {
	if (!src) return null;

	// allow the video to scale down on small screens while constraining max width
	const wrapperStyle = { maxWidth: `${width}px`, width: "100%", height: `${height}px` };

	// create a predictable class name per size so we can target mobile height via CSS
	const sizeClass = `video-resp-${width}x${height}`;
	// smaller height for mobile (70% of original, but not less than 200px)
	const mobileHeight = Math.max(200, Math.round(height * 0.7));

	return (
		<div className={`flex-shrink-0 ${sizeClass} ${className}`} style={wrapperStyle}>
			{/* scoped CSS to reduce the height only on small screens */}
			<style>{`
				.${sizeClass} { height: ${height}px; }
				@media (max-width: 640px) {
					.${sizeClass} { height: ${mobileHeight}px; }
				}
			`}</style>

			<div className="w-full h-full rounded-md overflow-hidden bg-black shadow-sm">
				<video
					src={src}
					poster={poster}
					className="w-full h-full object-cover"
					playsInline
					autoPlay
					loop
					muted
				/>
			</div>
		</div>
	);
}

