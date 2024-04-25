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

/**
 * Includes WordPress components for creating custom controls.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
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
 * Main Edit function for the WordPress custom block.
 *
 * This function defines the editing behavior of the block and is
 * responsible for rendering controls in the editor and managing state.
 *
 * @param {Object} props - Props passed by WordPress block editor.
 * @returns {JSX.Element} - JSX representation of the block editor view.
 */
export default function Edit(props) {
	// Destructure props to extract block attributes and setAttributes function
	const { attributes, setAttributes } = props;

	// Use useBlockProps to apply default block styles
	const blockProps = useBlockProps();

	// Default terms for the taxonomy selections
	const defaultSelectedTerms = {
		projecttype: "",
		projectcategory: "",
		projectclient: "",
	};

	// Get selected terms from attributes or use default values
    const { selectedTerms = defaultSelectedTerms } = attributes;

    // Local state to manage selected terms within the block
    const [localSelectedTerms, setLocalSelectedTerms] = useState(selectedTerms);

    // State to hold taxonomy terms for filtering options
	const [taxonomyTerms, setTaxonomyTerms] = useState({
		projecttype: [],
		projectcategory: [],
		projectclient: [],
	});

    // State to store fetched portfolio data
	const [portfolioData, setPortfolioData] = useState(null);

	/**
     * Fetches taxonomy terms when the block is first mounted.
     */
	useEffect(() => {
		fetchTaxonomyTerms("projecttype");
		fetchTaxonomyTerms("projectcategory");
		fetchTaxonomyTerms("projectclient");
	}, []); // Empty dependency array ensures this only runs on mount

	/**
     * Fetches portfolio data and updates block attributes when localSelectedTerms changes.
     */
	useEffect(() => {
		fetchPortfolioData();
		setAttributes({ selectedTerms: localSelectedTerms });
	}, [localSelectedTerms]); // Re-run when selected terms change

	/**
	 * Fetches portfolio data based on selected terms.
	 * The data is retrieved from a custom REST API endpoint.
	 */
	const fetchPortfolioData = async () => {
		// Base URL for fetching portfolio data
		let url = `http://localhost:1234/wp-test/wp-json/md-custom/gb-portfolio`;

		// Construct query parameters based on local selected terms
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(localSelectedTerms)) {
			if (value) {
				params.append(key, value);
			}
		}

		// If there are query parameters, add them to the URL
		if (params.toString()) {
			url += `?${params.toString()}`;
		}

		// Fetch portfolio data from the constructed URL
		const response = await fetch(url);
		const data = await response.json(); // Parse JSON response
		// Update the local state with the fetched portfolio data
		setPortfolioData(data);
	};

	/**
	 * Fetches terms for a specific taxonomy and updates the corresponding state.
	 * Handles errors gracefully and logs them to the console.
	 *
	 * @param {string} taxonomy - The taxonomy for which terms are fetched.
	 */
	const fetchTaxonomyTerms = async (taxonomy) => {
		try {
			const response = await fetch(
				`http://localhost:1234/wp-test/wp-json/wp/v2/${taxonomy}`,
			);
			// Parse JSON response to get terms
			const terms = await response.json();
			// Update the state with fetched terms for the specified taxonomy
			setTaxonomyTerms((prevState) => ({
				...prevState,
				[taxonomy]: terms,
			}));
		} catch (error) {
			// Log error to console if fetching terms fails
			console.error(`Error fetching ${taxonomy} terms:`, error);
		}
	};

	/**
	 * Handles changes in the selected term for a specific taxonomy.
	 * Updates the local state with the new selected value.
	 *
	 * @param {string} taxonomy - The taxonomy that is being changed.
	 * @param {string} value - The new selected value.
	 */
	const handleTermChange = (taxonomy, value) => {
		const updatedTerms = {
			[taxonomy]: value === "all" ? "" : value,
		};

		setLocalSelectedTerms((prevState) => ({
			...prevState,
			...updatedTerms,
		}));
	};

	/**
	 * Renders the block's user interface, including inspector controls
	 * and the portfolio data based on the selected terms.
	 */
	return (
		<div {...blockProps}>
			{/* Inspector controls for selecting taxonomy terms */}
			<InspectorControls>
				<PanelBody title="Filters"> {/* Panel for filter options */}
					<SelectControl
						label="Project Type"
						value={localSelectedTerms.projecttype}
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
						value={localSelectedTerms.projectcategory}
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
						value={localSelectedTerms.projectclient}
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

			{/* Render portfolio data or loading message */}
			{portfolioData ? (
				<PortfolioList portfolioData={portfolioData} />
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

/**
 * Component to render a list of portfolio items in a grid format.
 * It displays project details like title, thumbnail, and content excerpt, along with links to the full project.
 *
 * @param {Object} props - The component properties.
 * @param {Array} props.portfolioData - Array of portfolio project objects to display.
 * @returns {JSX.Element} - The JSX element representing the portfolio grid.
 */
function PortfolioList({ portfolioData }) {
    /**
     * Function to truncate content to a specified length, appending an ellipsis ("...") if truncated.
     *
     * @param {string} content - The original content string to be truncated.
     * @param {number} maxLength - The maximum allowed length before truncation.
     * @returns {string} - The truncated content, with ellipsis if needed.
     */
    const truncateContent = (content, maxLength) => {
        if (content.length > maxLength) {
            return content.substring(0, maxLength) + "..."; // Truncate and add ellipsis
        } else {
            return content; // No truncation needed
        }
    };

    return (
        <div className="portfolio-grid">
            {portfolioData.map((project) => (
                // Render each portfolio project as a grid item
                <div key={project.id} className="portfolio-item">
                    {/* Project title with a link to the full project */}
                    <a href={project.permalink} target="_blank" rel="noopener noreferrer">
                        <h2>{project.title}</h2> {/* Display project title */}
                    </a>

                    {/* Display project thumbnail image if available */}
                    {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.title} /> 
                    ) : (
                        <div>No image available</div> // Fallback if no thumbnail
                    )}

                    {/* Display a truncated version of the project content */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: truncateContent(project.content, 100), // Truncate content to 100 characters
                        }}
                    />

                    {/* Link to read more about the project */}
                    <a href={project.permalink} target="_blank" rel="noopener noreferrer">
                        Read more
                    </a>
                </div>
            ))}
        </div>
    );
}
