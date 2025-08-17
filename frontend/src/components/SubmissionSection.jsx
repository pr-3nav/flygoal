import React, { useState } from 'react';
import { Upload, Image, User, FileText, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SubmissionSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    designer: '',
    designFile: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        designFile: file
      }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.designer || !formData.designFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload a design.",
        variant: "destructive"
      });
      return;
    }

    // Mock submission
    toast({
      title: "Design submitted successfully!",
      description: `"${formData.title}" has been added to the voting gallery.`
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      designer: '',
      designFile: null
    });
    setPreviewUrl(null);
  };

  return (
    <section id="submit" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            SUBMIT YOUR DESIGN
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Got an amazing jersey design? Share it with the community and let them vote. 
            The most popular designs get produced and sold!
          </p>
        </div>

        {/* Submission Form */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-black mb-3">
                Design Image *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={previewUrl} 
                      alt="Design preview" 
                      className="mx-auto max-h-64 rounded-lg"
                    />
                    <p className="text-sm text-gray-600">{formData.designFile?.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, designFile: null }));
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-black mb-2">
                        Drop your design here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Design Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Thunder Bolt FC"
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <Image size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Your Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="designer"
                    value={formData.designer}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-3">
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your design inspiration, colors used, or any special meaning..."
                  rows={4}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Send size={20} />
                Submit Design
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-12 p-6 bg-gray-100 rounded-xl">
          <h3 className="text-lg font-bold text-black mb-4">Submission Guidelines</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Designs must be original and created by you</li>
            <li>• High resolution images (minimum 1000x1000px) preferred</li>
            <li>• No copyrighted logos or trademarked content</li>
            <li>• Keep it appropriate for all audiences</li>
            <li>• Voting opens immediately after submission</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SubmissionSection;