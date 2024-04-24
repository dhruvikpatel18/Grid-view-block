/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * Importing necessary hooks from WordPress Element package
 */
import { useState, useEffect } from "@wordpress/element";

/**
 * Exporting the Edit function as the default export of this module
 *
 * @returns {JSX.Element} The rendered JSX element for the Edit function
 */
export default function Edit() {
	
	const [portfolioData, setPortfolioData] = useState(null);
	const [selectedTerms, setSelectedTerms] = useState({
        projecttype: "",
        projectcategory: "",
        projectclient: "",
    });

    useEffect(() => {
        // Save selected filters to post meta
        saveSelectedFilters(selectedTerms);
    }, [selectedTerms]);

    const saveSelectedFilters = (filters) => {
        wp.data.dispatch('core/editor').editPost({ meta: { 'selected_filters': filters } });
    };
	const [taxonomyTerms, setTaxonomyTerms] = useState({
		projecttype: [],
		projectcategory: [],
		projectclient: [],
	});

	useEffect(() => {
		fetchPortfolioData();
		fetchTaxonomyTerms("projecttype");
		fetchTaxonomyTerms("projectcategory");
		fetchTaxonomyTerms("projectclient");
	}, [selectedTerms]);

	const fetchPortfolioData = async () => {
		try {
			let url = `http://localhost:1234/wp-test/wp-json/md-custom/gb-portfolio`;
	
			// Add selected terms to URL if not empty
			const selectedTermsArray = Object.values(selectedTerms);
			const nonEmptyTerms = selectedTermsArray.filter(term => term !== "");
			if (nonEmptyTerms.length > 0) {
				const params = new URLSearchParams(selectedTerms);
				url += `?${params.toString()}`;
			}
	
			const response = await fetch(url);
			const data = await response.json();
			setPortfolioData(data);
		} catch (error) {
			console.error("Error fetching portfolio data:", error);
		}
	};

	const fetchTaxonomyTerms = async (taxonomy) => {
		try {
			const response = await fetch(
				`http://localhost:1234/wp-test/wp-json/wp/v2/${taxonomy}`,
			);
			const terms = await response.json();
			setTaxonomyTerms((prevState) => ({
				...prevState,
				[taxonomy]: terms,
			}));
		} catch (error) {
			console.error(`Error fetching ${taxonomy} terms:`, error);
		}
	};

	const handleTermChange = (taxonomy, termId) => {
		setSelectedTerms((prevState) => ({
			...prevState,
			[taxonomy]: termId === "all" ? "" : termId,
		}));
		const queryParams = new URLSearchParams(window.location.search);
		queryParams.set(taxonomy, termId);
		const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
		window.history.pushState({ path: newUrl }, "", newUrl);
	};

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Filters">
					<SelectControl
						label="Project Type"
						value={selectedTerms.projecttype}
						onChange={(value) => handleTermChange("projecttype", value)}
						options={[
							{ label: "All", value: "all" },
							...taxonomyTerms.projecttype.map((term) => ({
								label: term.name,
								value: term.slug,
							})),
						]}
					/>
					<SelectControl
						label="Project Category"
						value={selectedTerms.projectcategory}
						onChange={(value) => handleTermChange("projectcategory", value)}
						options={[
							{ label: "All", value: "all" },
							...taxonomyTerms.projectcategory.map((term) => ({
								label: term.name,
								value: term.slug,
							})),
						]}
					/>
					<SelectControl
						label="Project Client"
						value={selectedTerms.projectclient}
						onChange={(value) => handleTermChange("projectclient", value)}
						options={[
							{ label: "All", value: "all" },
							...taxonomyTerms.projectclient.map((term) => ({
								label: term.name,
								value: term.slug,
							})),
						]}
					/>
				</PanelBody>
			</InspectorControls>
			{portfolioData ? (
				<PortfolioList portfolioData={portfolioData} />
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

function PortfolioList({ portfolioData }) {
	const truncateContent = (content, maxLength) => {
		if (content.length > maxLength) {
			return content.substring(0, maxLength) + "...";
		} else {
			return content;
		}
	};
	console.log("Portfolio data:", portfolioData);
	return (
		<div className="portfolio-grid">
			{portfolioData.map((project) => (
				<div key={project.id} className="portfolio-item">
					<a href={project.permalink} target="_blank" rel="noopener noreferrer">
						<h2>{project.title}</h2>
					</a>
					{project.featured_image && (
						<img src={project.featured_image.url} alt={project.title} />
					)}
					<div
						dangerouslySetInnerHTML={{
							__html: truncateContent(project.content, 100),
						}}
					/>
				</div>
			))}
		</div>
	);
}
