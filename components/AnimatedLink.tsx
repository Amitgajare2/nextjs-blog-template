"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React, { MouseEvent } from "react";

interface AnimatedLinkProps extends LinkProps {
	children: React.ReactNode;
	className?: string;
	onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export default function AnimatedLink({ children, className, onClick, href, ...rest }: AnimatedLinkProps) {
	const router = useRouter();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (onClick) onClick(e);
		if (e.defaultPrevented) return;

		// Only intercept left-click without modifier keys
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
			return;
		}

		e.preventDefault();

		// Dispatch a custom event so PageTransition can start the cover immediately
		window.dispatchEvent(new CustomEvent("page:cover:start"));

		// Slight delay to allow the cover to start before navigating
		setTimeout(() => {
			if (typeof href === "string") {
				router.push(href);
			} else {
				// For UrlObject
				router.push(href as any);
			}
		}, 50);
	};

	return (
		<Link href={href} onClick={handleClick} className={className} {...rest}>
			{children}
		</Link>
	);
}
