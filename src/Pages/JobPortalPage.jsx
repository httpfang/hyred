import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Share2, MapPin, Briefcase, DollarSign, Star, Check } from 'lucide-react';
import jobListings from '../data/jobListings';  // Adjust the import path as needed

// Utility function for job filtering
const filterJobs = (jobs, filters) => {
  return jobs.filter(job => {
    const matchesSearch = !filters.searchQuery || 
      job.companyName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      job.jobPosition.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    const matchesLocation = !filters.location || job.location.includes(filters.location);
    
    return matchesSearch && matchesJobType && matchesLocation;
  });
};

// Job Card Component with Sharing
const JobCard = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleShare = () => {
    const shareUrl = `https://hyred.com/jobs/${job.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowSharePopup(true);
      setTimeout(() => {
        setShowSharePopup(false);
      }, 2000);
    });
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative h-full">
      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-3">
                <Check size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Link Copied!</h3>
            <p className="text-gray-600 mb-4">The job link has been copied to your clipboard.</p>
            <button 
              onClick={() => setShowSharePopup(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-grow">
        <div className="w-full flex space-x-6">
          {/* Left Side: Company Logo and Basic Info */}
          <div className="w-1/4 flex-shrink-0">
            <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {job.companyName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{job.jobPosition}</h3>
              <p className="text-gray-500 text-sm line-clamp-1">{job.companyName}</p>
            </div>
          </div>

          {/* Middle: Job Details */}
          <div className="flex-grow space-y-4">
            <div className="grid grid-cols-4 gap-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm truncate">{job.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm truncate">{job.jobType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm truncate">{job.salary}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm truncate">{job.experience}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm">
              {showFullDescription 
                ? job.jobDescription 
                : `${job.jobDescription.slice(0, 250)}...`}
              {job.jobDescription.length > 250 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 ml-2 text-xs font-semibold"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side: Share and Apply */}
          <div className="w-1/6 flex flex-col justify-between items-end">
            <button 
              onClick={handleShare}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Share job"
            >
              <Share2 size={24} />
            </button>

            <button 
              onClick={() => window.open(job.applyLink, '_blank')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Search and Filters Component
const JobSearch = ({ onSearchChange, onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    jobType: '',
    location: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    if (name === 'searchQuery') {
      onSearchChange(value);
    } else {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text"
          name="searchQuery"
          placeholder="Search jobs by company, position, or location..."
          value={filters.searchQuery}
          onChange={handleInputChange}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <select 
          name="jobType"
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <select 
          name="location"
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
        >
          <option value="">All Locations</option>
          <option value="San Francisco, CA">San Francisco, CA</option>
          <option value="New York, NY">New York, NY</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
    </div>
  );
};

// Main Job Portal Page
const JobPortalPage = () => {
  const [filteredJobs, setFilteredJobs] = useState(jobListings);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const handleSearch = (query) => {
    const filtered = filterJobs(jobListings, { searchQuery: query });
    setFilteredJobs(filtered);
    setPage(1);
  };

  const handleFilterChange = (filters) => {
    const filtered = filterJobs(jobListings, filters);
    setFilteredJobs(filtered);
    setPage(1);
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  const visibleJobs = filteredJobs.slice(0, page * 6);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Hyred</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your gateway to exciting career opportunities. Find the perfect job that matches your skills and aspirations.
          </p>
        </div>

        <div className="mb-12">
          <JobSearch 
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="space-y-6">
          {visibleJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {visibleJobs.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-2xl font-semibold">No jobs found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {visibleJobs.length < filteredJobs.length && (
          <div ref={loader} className="h-10 text-center mt-8">
            <p className="text-gray-500">Loading more jobs...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPortalPage;
