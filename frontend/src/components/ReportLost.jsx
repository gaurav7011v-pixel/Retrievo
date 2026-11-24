import { useEffect, useState } from "react";
import api from "../api/axios";
import { reportLostItem } from "../api/itemService";
import StudentLayout from "../layouts/StudentLayout";

import {
  Package,
  MapPin,
  Calendar,
  Upload,
  ImagePlus,
  X,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";

function ReportLost() {

  const [loading, setLoading] = useState(false);
  // Stores all the form information
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    dateLost: "",
    identifyingDetails: "",
  });

  // Stores the uploaded image
  const [imageFile, setImageFile] = useState(null);

  // Stores the image preview URL
  const [imagePreview, setImagePreview] = useState("");

  // Stores success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handles changes in text inputs and dropdowns
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Handles image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size should not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    setErrorMessage("");
    setImageFile(file);
  };

  // Creates and cleans up the image preview URL
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewURL = URL.createObjectURL(imageFile);
    setImagePreview(previewURL);

    return () => URL.revokeObjectURL(previewURL);
  }, [imageFile]);

  // Removes the selected image
  const removeImage = () => {
    setImageFile(null);

    const fileInput = document.getElementById("itemImage");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload image if selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadResponse = await api.post(
          "/items/upload-image",
          uploadData
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      // 2. Prepare item data
      const itemData = {
        itemName: formData.itemName,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        itemDate: formData.dateLost,
        additionalDetails: formData.identifyingDetails,
        imageUrl: imageUrl
      };

      // 3. Submit lost item report
      const response = await reportLostItem(itemData);

      console.log("Saved item:", response);

      setSuccessMessage(
        "Your lost item report has been submitted successfully!"
      );

      // 4. Reset form
      setFormData({
        itemName: "",
        category: "",
        description: "",
        location: "",
        dateLost: "",
        identifyingDetails: "",
      });

      setImageFile(null);

      const fileInput = document.getElementById("itemImage");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error("Error submitting lost item:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Something went wrong while submitting your report."
      );

    } finally {
      setLoading(false);
    }
  };
  
  return (
    <StudentLayout>
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#6254C7]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-[#6254C7]">
              <Package size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                Report a Lost Item
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Tell us about the item you lost on campus.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle size={21} />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Item Information */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                01. Item Information
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Provide basic information about your lost item.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Item Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="e.g. Blue Water Bottle"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Books and Notes">Books and Notes</option>
                  <option value="ID Cards">ID Cards</option>
                  <option value="Bags">Bags</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Item Description <span className="text-red-500">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item, including its colour, brand, size, or other details..."
                rows="4"
                required
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Identifying Details */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Additional Identifying Details
              </label>

              <textarea
                name="identifyingDetails"
                value={formData.identifyingDetails}
                onChange={handleChange}
                placeholder="Any unique marks, stickers, scratches, or other details? (Optional)"
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

          </section>

          {/* Section 2: Location and Date */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                02. Where and When?
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Help others identify where you might have lost it.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Location */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin size={16} className="text-[#6254C7]" />
                  Location Last Seen <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Library, Block A, Canteen"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar size={16} className="text-[#6254C7]" />
                  Date Lost <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="dateLost"
                  value={formData.dateLost}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                />
              </div>

            </div>
          </section>

          {/* Section 3: Image Upload */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                03. Upload an Image
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Adding a photograph can make your item easier to identify.
              </p>
            </div>

            {!imagePreview ? (
              <label
                htmlFor="itemImage"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-[#6254C7] hover:bg-purple-50"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-[#6254C7]">
                  <ImagePlus size={27} />
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  Click to upload an image
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  PNG, JPG or JPEG (Maximum 5 MB)
                </p>

                <input
                  id="itemImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Lost item preview"
                  className="h-52 w-64 rounded-xl border border-gray-200 object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                >
                  <X size={17} />
                </button>

                <p className="mt-2 text-xs text-gray-500">
                  {imageFile?.name}
                </p>
              </div>
            )}

          </section>

          {/* Submit Button */}
          <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">

            <p className="text-xs text-gray-400">
              Fields marked with * are required.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6254C7] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5143B5] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={18} />

              {loading ? "Submitting..." : "Submit Lost Item Report"}
            </button>

          </div>

        </form>

      </div>
    </StudentLayout>
  );
}

export default ReportLost;