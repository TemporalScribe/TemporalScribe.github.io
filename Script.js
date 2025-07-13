import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for client-side rendering

const App = () => {
    // State to manage which page is currently displayed: 'home' or a specific 'story' ID
    const [currentPage, setCurrentPage] = useState('home');
    // State to hold all story data
    const [stories, setStories] = useState([]);
    // State to hold the currently selected story object for display
    const [selectedStory, setSelectedStory] = useState(null);
    // State to track if stories are loading
    const [loading, setLoading] = useState(true);
    // State to track if there was an error loading stories
    const [error, setError] = useState(null);

    // Effect to load stories and handle initial page routing
    useEffect(() => {
        const fetchStories = async () => {
            try {
                // Fetch story data from the 'stories.json' file
                const response = await fetch('/stories.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStories(data);
            } catch (e) {
                console.error("Error loading stories.json:", e);
                setError("Failed to load stories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStories();

        // Basic routing: Check URL hash for story ID
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1); // Get hash without '#'
            if (hash && stories.length > 0) { // Ensure stories are loaded before finding
                const foundStory = stories.find(story => story.id === hash);
                if (foundStory) {
                    setCurrentPage('story');
                    setSelectedStory(foundStory);
                } else {
                    setCurrentPage('home');
                    setSelectedStory(null);
                }
            } else {
                setCurrentPage('home');
                setSelectedStory(null);
            }
        };

        // Add event listener only after stories are potentially loaded or an error occurs
        // This ensures 'stories' state is stable when handleHashChange runs for the first time
        const timeoutId = setTimeout(() => { // Small delay to ensure stories state is updated
            window.addEventListener('hashchange', handleHashChange);
            handleHashChange(); // Call on initial load
        }, 100);


        // Cleanup event listener and timeout
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            clearTimeout(timeoutId);
        };
    }, [stories]); // Dependency on 'stories' to re-run hash change logic once stories are loaded

    // Function to navigate to a story page
    const navigateToStory = useCallback((storyId) => {
        window.location.hash = storyId; // Update URL hash for simple routing
    }, []);

    // Function to navigate back to the homepage
    const navigateToHome = useCallback(() => {
        window.location.hash = ''; // Clear URL hash
        setCurrentPage('home');
        setSelectedStory(null);
    }, []);

    // Component for the Header
    const Header = () => (
        <header className="bg-gray-800 shadow-lg py-4 px-6 md:px-12">
            <nav className="container mx-auto flex justify-between items-center">
                <a href="#" onClick={navigateToHome} className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-all duration-300">
                    Temporal Echoes
                </a>
                <ul className="flex space-x-6">
                    <li><a href="#" onClick={navigateToHome} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">Home</a></li>
                    <li><a href="#stories" onClick={() => { /* Placeholder for future 'All Stories' page */ }} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">Stories</a></li>
                    <li><a href="#about" onClick={() => { /* Placeholder for future 'About' page */ }} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">About</a></li>
                    <li><a href="#contact" onClick={() => { /* Placeholder for future 'Contact' page */ }} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">Contact</a></li>
                </ul>
            </nav>
        </header>
    );

    // Component for the Footer
    const Footer = () => (
        <footer className="bg-gray-800 py-8 px-6 md:px-12 text-center text-gray-400">
            <div className="container mx-auto">
                <p>&copy; 2025 Temporal Echoes. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    );

    // Component for the Homepage (Hero + Featured Stories)
    const HomePage = ({ stories, navigateToStory, loading, error }) => (
        <>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <img src="https://placehold.co/1920x600/34495e/ffffff?text=Time+Slip+Background" alt="Abstract time-slip background" className="absolute inset-0 w-full h-full object-cover z-0" />

                <div className="relative z-20 p-8 max-w-4xl mx-auto bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                        Where Moments Transcend Time
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explore a collection of AI-assisted flash fiction, weaving tales of past, present, and future in a single, captivating breath.
                    </p>
                    <a href="#" onClick={() => navigateToStory(stories[0]?.id || '')} className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                        Begin Your Journey
                    </a>
                </div>
            </section>

            {/* Featured Stories Section */}
            <section className="py-16 px-6 md:px-12 bg-gray-900">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-12">Featured Echoes</h2>
                    {loading && <p className="text-center text-xl text-gray-400">Loading stories...</p>}
                    {error && <p className="text-center text-xl text-red-400">{error}</p>}
                    {!loading && !error && stories.length === 0 && (
                        <p className="text-center text-xl text-gray-400">No stories found. Check back soon!</p>
                    )}
                    {!loading && !error && stories.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.slice(0, 3).map(story => ( // Display up to 3 featured stories
                                <div key={story.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2">
                                    <img src={story.thumbnailUrl} alt={`${story.title} thumbnail`} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold text-white mb-2">{story.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{story.subtitle}</p>
                                        <a href="#" onClick={() => navigateToStory(story.id)} className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300">Read More &rarr;</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-12">
                        <a href="#stories" onClick={() => { /* Placeholder for future 'All Stories' page */ }} className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                            View All Stories
                        </a>
                    </div>
                </div>
            </section>
        </>
    );

    // Component for Individual Story Page
    const StoryPage = ({ story, navigateToHome }) => {
        // Anti-download measures
        useEffect(() => {
            const disableRightClick = (e) => {
                e.preventDefault();
                // Optionally show a message: showMessage("Right-click is disabled to protect content.", "info");
            };
            // This CSS property is the most effective way to prevent text selection
            // We apply it to the body when a story page is active.
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none'; // For WebKit browsers
            document.body.style.mozUserSelect = 'none'; // For Mozilla browsers
            document.body.style.msUserSelect = 'none'; // For IE/Edge

            document.addEventListener('contextmenu', disableRightClick);

            return () => {
                document.removeEventListener('contextmenu', disableRightClick);
                // Reset user-select style when component unmounts
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
                document.body.style.mozUserSelect = '';
                document.body.style.msUserSelect = '';
            };
        }, [story]); // Re-apply if story changes

        if (!story) {
            return <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Story not found.</div>;
        }

        return (
            <div className="py-16 px-6 md:px-12 bg-gray-900 min-h-screen">
                <div className="container mx-auto max-w-3xl bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 border border-gray-700">
                    <button onClick={navigateToHome} className="mb-8 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 flex items-center">
                        &larr; Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">{story.title}</h1>
                    <p className="text-xl text-gray-400 mb-6">{story.subtitle}</p>
                    {story.thumbnailUrl && (
                        <img src={story.thumbnailUrl} alt={`${story.title} cover`} className="w-full h-64 object-cover rounded-lg mb-8 shadow-md" />
                    )}
                    <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap" style={{ userSelect: 'none' }}>
                        {story.storyText}
                    </div>
                    {/* Placeholder for audio player (pre-generated) */}
                    {/*
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white mb-3">Listen to the Story:</h3>
                        <audio controls className="w-full">
                            <source src={`/audio/${story.id}.mp3`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                    */}
                    {/* Placeholder for Buy Me a Coffee button */}
                    {/*
                    <div className="mt-8 text-center">
                        <a href="YOUR_BUY_ME_A_COFFEE_LINK" target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                            Buy Me A Coffee!
                        </a>
                    </div>
                    */}
                    {/* Placeholder for Comments Section */}
                    {/*
                    <div className="mt-12">
                        <h3 className="text-xl font-semibold text-white mb-3">Comments:</h3>
                        <div id="disqus_thread"></div>
                        <script>
                            // DISQUS_CODE_HERE
                        </script>
                    </div>
                    */}
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 antialiased">
            <Header />
            <main>
                {loading && <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Loading stories...</div>}
                {error && <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">{error}</div>}
                {!loading && !error && (
                    <>
                        {currentPage === 'home' && (
                            <HomePage stories={stories} navigateToStory={navigateToStory} loading={loading} error={error} />
                        )}
                        {currentPage === 'story' && selectedStory && (
                            <StoryPage story={selectedStory} navigateToHome={navigateToHome} />
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

// Mount the App component to the 'root' div in index.html
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);