import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Save, ArrowLeft, Calendar, FileText, Loader2
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import PageHeader from '../components/common/PageHeader';
import api from '../../../lib/api';

const BlogManagement = ({ defaultCategory = 'All' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        _id: null,
        title: '',
        category: 'General',
        image: '',
        excerpt: '',
        content: '',
        author: 'Admin'
    });

    const categories = ['NAMMATAXI', 'AIRPORTTAXISERVICE', 'Travel Guide', 'Taxi News', 'General'];

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/posts');
            if (res && res.data) {
                setBlogs(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        setSelectedCategory(defaultCategory);
    }, [defaultCategory]);

    const handleEdit = (blog) => {
        setFormData(blog);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await api.delete(`/posts/${id}`);
                fetchPosts();
            } catch (error) {
                alert('Failed to delete post');
            }
        }
    };

    const handleAddNew = () => {
        setFormData({
            _id: null,
            title: '',
            category: selectedCategory !== 'All' ? selectedCategory : 'General',
            image: '',
            excerpt: '',
            content: '',
            author: 'Admin'
        });
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            if (formData._id) {
                await api.patch(`/posts/${formData._id}`, formData);
            } else {
                await api.post('/posts', formData);
            }
            setIsEditing(false);
            fetchPosts();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading && !isEditing) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-black" size={40} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Post Archive...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 pb-10 animate-in fade-in duration-500 font-sans">
            {!isEditing ? (
                <>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-4">
                        <PageHeader
                            title="Registry Management"
                            subtitle="Dynamic control panel for platform articles and bulletins."
                        />
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg"
                        >
                            <Plus size={16} strokeWidth={3} />
                            Create Entry
                        </button>
                    </div>

                    <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row gap-2 items-center justify-between">
                        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0 bg-gray-50/50 p-1">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                            >
                                All Records
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <input
                                type="text"
                                placeholder="FILTER DATABASE..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-black/5 rounded-none text-[10px] font-black tracking-widest text-black focus:outline-none focus:border-black placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBlogs.map(blog => (
                            <div key={blog._id} className="group bg-white rounded-none border border-black/5 overflow-hidden hover:border-black transition-all duration-300 flex flex-col h-full shadow-sm">
                                <div className="h-44 overflow-hidden relative">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 rounded-none text-[7px] font-black uppercase tracking-widest border border-white/10">
                                        {blog.category}
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="p-2.5 bg-white rounded-none text-black shadow-lg hover:bg-[#F7DC9D] transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2.5 bg-red-600 rounded-none text-white shadow-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 text-[8px] text-gray-400 font-black uppercase tracking-widest">
                                        <Calendar size={10} />
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{blog.author}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-black mb-1 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-4 flex-1 font-bold uppercase tracking-tight italic">{blog.excerpt}</p>

                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="w-full py-2.5 rounded-none bg-gray-50 text-black text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white border border-black/5 transition-all"
                                    >
                                        Modify Registry
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-20 bg-gray-50/30 rounded-none border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center mx-auto mb-4 text-gray-200 border border-gray-100 shadow-sm">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-[11px] font-black text-black uppercase tracking-widest">No matching records found</h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">The archive is currently empty for this classification.</p>
                        </div>
                    )}
                </>
            ) : (
                <form onSubmit={handleSave} className="bg-white rounded-none shadow-xl border border-black/5 overflow-hidden">
                    <div className="p-4 border-b border-black/5 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-white rounded-none text-gray-400 transition-colors border border-transparent hover:border-black/5"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <div>
                                <h2 className="text-lg font-black text-black uppercase tracking-tight leading-none">
                                    {formData._id ? 'Entry Revision' : 'New Publication'}
                                </h2>
                                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                    System Protocol: Article Deployment
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest text-black bg-white border border-black/5 hover:bg-gray-50"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest text-black bg-[#F7DC9D] hover:bg-[#eec96d] shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {formData._id ? 'Update Database' : 'Publish to Live'}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ENTRY TITLE..."
                                    className="w-full p-3 bg-gray-50/50 border border-black/5 rounded-none text-xl font-black text-black placeholder:text-gray-300 focus:border-black outline-none transition-all uppercase tracking-tighter"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Abstract Summary (Excerpt)</label>
                                <textarea
                                    rows="2"
                                    placeholder="BRIEF OVERVIEW FOR PREVIEW CARDS..."
                                    className="w-full p-3 bg-gray-50/50 border border-black/5 rounded-none text-[10px] font-bold tracking-tight text-black placeholder:text-gray-300 focus:border-black outline-none transition-all resize-none uppercase leading-relaxed"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Editorial Content Registry</label>
                                <div className="prose-admin">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        className="bg-white rounded-none h-[450px] mb-14 border border-black/5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">System Classification</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {categories.map(cat => (
                                        <label key={cat} className={`flex items-center gap-3 p-3 rounded-none border-2 cursor-pointer transition-all ${formData.category === cat ? 'border-black bg-black/5' : 'border-gray-50 hover:border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="accent-black w-4 h-4"
                                                checked={formData.category === cat}
                                                onChange={() => setFormData({ ...formData, category: cat })}
                                            />
                                            <span className="text-[10px] font-black text-black uppercase tracking-widest">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Media Banner URL</label>
                                <div className="border border-dashed border-gray-200 rounded-none p-4 text-center hover:bg-gray-50 transition-colors group bg-gray-50/30">
                                    {formData.image ? (
                                        <div className="relative aspect-[16/9] rounded-none overflow-hidden mb-4 shadow-lg border border-black/5">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-none shadow-xl hover:scale-110 transition-transform"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-10 text-gray-300">
                                            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-10" />
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em]">No Media Detected</p>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="HTTP://IMAGE-URL.COM..."
                                        className="w-full p-3 bg-white border border-gray-200 rounded-none text-[10px] font-black tracking-widest focus:border-black outline-none shadow-sm"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            <style>{`
                .ql-toolbar.ql-snow {
                    border-radius: 0;
                    border-color: #f3f4f6;
                    background-color: #f9fafb;
                    padding: 12px;
                }
                .ql-container.ql-snow {
                    border-radius: 0;
                    border-color: #f3f4f6;
                    font-family: inherit;
                }
                .ql-editor {
                    min-height: 350px;
                    padding: 1.5rem;
                    color: #000;
                    font-size: 0.95rem;
                }
                .ql-editor.ql-blank::before {
                    color: #d1d5db;
                    font-style: italic;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.1em;
                }
            `}</style>
        </div>
    );
};

export default BlogManagement;
