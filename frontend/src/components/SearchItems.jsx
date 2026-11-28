import { useEffect, useState } from "react";
import api from "../api/axios";
import { getAllItems } from "../api/itemService";
import StudentLayout from "../layouts/StudentLayout";
import { Link } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Calendar,
    Package,
    X,
} from "lucide-react";


function SearchItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    // Search input
    const [search, setSearch] = useState("");

    // Selected filters
    const [selectedType, setSelectedType] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const data = await getAllItems();

                setItems(data);

            } catch (error) {
                console.error("Error fetching items:", error);

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load items. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);
    // Filter items
    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
            item.description?.toLowerCase().includes(search.toLowerCase()) ||
            item.location?.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            selectedType === "All" ||
            item.itemType === selectedType.toUpperCase();

        const matchesCategory =
            selectedCategory === "All" ||
            item.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;
    });
    // Reset filters
    const resetFilters = () => {
        setSearch("");
        setSelectedType("All");
        setSelectedCategory("All");
    };

    return (
        <StudentLayout>
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                        Browse Items
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Search through lost and found items reported on campus.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                    {/* Search Input */}
                    <div className="relative mb-5">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by item name, description or location..."
                            className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div className="flex flex-wrap items-center gap-3">

                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <SlidersHorizontal size={17} />
                                Filters:
                            </div>

                            {/* Type Filter */}
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#6254C7]"
                            >
                                <option value="All">All Items</option>
                                <option value="Lost">Lost Items</option>
                                <option value="Found">Found Items</option>
                            </select>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#6254C7]"
                            >
                                <option value="All">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Books and Notes">Books and Notes</option>
                                <option value="ID Cards">ID Cards</option>
                                <option value="Bags">Bags</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Other">Other</option>
                            </select>

                        </div>

                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 text-sm font-medium text-[#6254C7] hover:text-[#5143B5]"
                        >
                            <X size={16} />
                            Clear Filters
                        </button>

                    </div>
                </div>

                {/* Results Heading */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Available Reports
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            {filteredItems.length} items found
                        </p>
                    </div>
                </div>


                {/* Items Grid */}

                {loading ? (

                    <div className="py-16 text-center text-gray-500">
                        Loading items...
                    </div>

                ) : errorMessage ? (

                    <div className="rounded-xl bg-red-50 p-5 text-center text-red-600">
                        {errorMessage}
                    </div>

                ) : filteredItems.length > 0 ? (

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                        {filteredItems.map((item) => (

                            <div
                                key={item.id}
                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* Item Image */}

                                <div className="relative h-52 overflow-hidden bg-gray-100">

                                    {item.imageUrl ? (
                                        <img
                                            src={
                                                item.imageUrl.startsWith("http")
                                                    ? item.imageUrl
                                                    : `${api.defaults.baseURL.replace("/api", "")}${item.imageUrl}`
                                            }
                                            alt={item.itemName}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-purple-50">
                                            <Package size={50} className="text-[#6254C7]" />
                                        </div>
                                    )}

                                    <span
                                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${item.itemType === "LOST"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {item.itemType}
                                    </span>

                                </div>

                                {/* Item Details */}

                                <div className="p-5">

                                    <div className="mb-3 flex items-start justify-between gap-3">

                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.itemName}
                                        </h3>

                                        <span className="rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-[#6254C7]">
                                            {item.category}
                                        </span>

                                    </div>

                                    <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                        {item.description}
                                    </p>

                                    <div className="space-y-2 border-t border-gray-100 pt-4">

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MapPin size={15} className="text-[#6254C7]" />
                                            {item.location}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={15} className="text-[#6254C7]" />
                                            {item.itemDate}
                                        </div>

                                    </div>

                                    <Link
                                        to={`/item/${item.id}`}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-50 py-3 text-sm font-semibold text-[#6254C7] transition hover:bg-[#6254C7] hover:text-white"
                                    >
                                        <Package size={17} />
                                        View Details
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-[#6254C7]">
                            <Search size={28} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800">
                            No items found
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={resetFilters}
                            className="mt-5 rounded-xl bg-[#6254C7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5143B5]"
                        >
                            Clear Filters
                        </button>

                    </div>

                )}
            </div>
        </StudentLayout>
    );
}

export default SearchItems;
