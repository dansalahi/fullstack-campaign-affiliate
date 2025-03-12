import { Influencer } from "../../../types";
import { useState, useEffect } from "react";

type Props = {
  influencers: Influencer[];
};

const InfluencersTable = ({ influencers }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInfluencers, setFilteredInfluencers] =
    useState<Influencer[]>(influencers);

  // Update filtered influencers whenever search term or influencers list changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInfluencers(influencers);
    } else {
      const filtered = influencers.filter((influencer) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          influencer.name.toLowerCase().includes(searchTermLower) ||
          influencer._id.toLowerCase().includes(searchTermLower) ||
          influencer.country.toLowerCase().includes(searchTermLower) ||
          influencer.status.toLowerCase().includes(searchTermLower)
        );
      });
      setFilteredInfluencers(filtered);
    }
  }, [searchTerm, influencers]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative overflow-x-auto bg-transparent">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 ">
        <h5 className="font-bold">Influencers</h5>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative w-1/2">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full min-w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search influencers"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {filteredInfluencers.length === 0 ? (
        <p className="text-gray-600">
          {influencers.length === 0
            ? "No influencers assigned"
            : "No influencers match your search criteria"}
        </p>
      ) : (
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-white  dark:text-gray-400">
            <tr className="border-b  dark:border-gray-700 border-gray-200 ">
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                UID
              </th>
              <th scope="col" className="px-6 py-3">
                Influencer
              </th>
              <th scope="col" className="px-6 py-3">
                Country
              </th>
              <th scope="col" className="px-6 py-3">
                Followers
              </th>
              <th scope="col" className="px-6 py-3">
                Revenue
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInfluencers.map((influencer, index) => (
              <tr
                key={`${influencer._id}-${index}`}
                className="border-b  dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-search-${index}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <td className="w-12 px-6 py-4">{influencer._id}</td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={influencer.avatar}
                    alt={influencer.name}
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {influencer.name}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{influencer.country}</td>
                <td className="px-6 py-4">{influencer.followers}</td>
                <td className="px-6 py-4">{influencer.baseCost}</td>
                <td className="px-6 py-4">
                  <span className="rounded-2xl bg-green-500 text-white px-1 py-0.5 text-xs">
                    {influencer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InfluencersTable;
