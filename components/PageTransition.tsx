"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface PageTransitionProps {
	children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();
	const overlayRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	// Prevent animating on the first render for perceived smoothness
	const hasMountedRef = useRef(false);
	const preNavAnimatingRef = useRef(false);

	// Enter animation when route/pathname changes
	useLayoutEffect(() => {
		if (!overlayRef.current || !contentRef.current) return;

		const startCover = (_e?: Event) => {
			if (!overlayRef.current) return;
			if (preNavAnimatingRef.current) return;
			preNavAnimatingRef.current = true;
			gsap.killTweensOf(overlayRef.current);
			gsap.set(overlayRef.current, { yPercent: 100, display: "block", pointerEvents: "auto" });
			gsap.to(overlayRef.current, { yPercent: 0, duration: 0.45, ease: "power3.inOut" });
		};

		window.addEventListener("page:cover:start", startCover);

		const ctx = gsap.context(() => {
			const overlay = overlayRef.current!;
			const content = contentRef.current!;

			// Use GPU-accelerated transforms and will-change hints
			gsap.set([overlay, content], {
				force3D: true,
				willChange: "transform, opacity",
				transformPerspective: 1000,
				webkitFontSmoothing: "antialiased",
			});

			// Skip animation on first mount for smooth initial paint
			if (!hasMountedRef.current) {
				hasMountedRef.current = true;
				gsap.set(overlay, { yPercent: 100, display: "none" });
				gsap.set(content, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
				return;
			}

			const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			if (prefersReduced) {
				// Simple crossfade for reduced motion
				gsap.set(overlay, { display: "none" });
				gsap.fromTo(
					content,
					{ autoAlpha: 0 },
					{ autoAlpha: 1, duration: 0.25, ease: "power1.out" }
				);
				return;
			}

			const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

			// Lock scroll while covered
			const originalOverflow = document.documentElement.style.overflow;
			document.documentElement.style.overflow = "hidden";

			// Cover screen
			if (!preNavAnimatingRef.current) {
				// If cover wasn't started by click, start it now (may appear slightly late)
				tl.set(overlay, { yPercent: 100, display: "block", pointerEvents: "auto" });
				tl.to(overlay, { yPercent: 0, duration: 0.5 });
			}

			// Swap content while covered
			tl.set(content, { autoAlpha: 0, y: 10, filter: "blur(6px)" });

			// Reveal new page
			tl.to(overlay, { yPercent: -100, duration: 0.65 });
			tl.set(overlay, { display: "none", pointerEvents: "none" });

			// Bring in new content as overlay moves away
			tl.to(
				content,
				{ autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" },
				"<0.15"
			);

			tl.add(() => {
				document.documentElement.style.overflow = originalOverflow;
				preNavAnimatingRef.current = false;
			});
		});

        return () => {
            window.removeEventListener("page:cover:start", startCover);
            ctx.revert();
        };
	}, [pathname]);

	return (
		<div style={{ position: "relative" }}>
			<div
				ref={overlayRef}
				aria-hidden
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 9999,
					background: "linear-gradient(135deg, var(--accent) 0%, var(--text-primary) 100%)",
					transform: "translate3d(0, 100%, 0)",
					backfaceVisibility: "hidden",
					willChange: "transform",
					display: "none",
				}}
			/>
			<div ref={contentRef} key={pathname} style={{ minHeight: "100vh" }}>
				{children}
			</div>
		</div>
	);
}
