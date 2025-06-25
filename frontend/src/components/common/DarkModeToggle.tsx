import React, { useState, useEffect } from "react";

const DarkModeToggle: React.FC = () => {
	const [isDark, setIsDark] = useState(false);

	// Load saved theme on component mount
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const systemPrefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;

		// Check if we should start in dark mode
		const shouldBeDark =
			savedTheme === "dark" || (!savedTheme && systemPrefersDark);

		setIsDark(shouldBeDark);

		// Apply the theme immediately
		if (shouldBeDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);

		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className="theme-toggle"
			type="button"
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
		>
			{isDark ? "🌙" : "☀️"}
		</button>
	);
};

export default DarkModeToggle;
