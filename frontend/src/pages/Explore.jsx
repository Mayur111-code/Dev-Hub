import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/layout/Navbar';
import { ExternalLink, Zap, MessageCircle, Heart, Tag } from 'lucide-react';

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

function DevCommunityFeed() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://dev.to/api/articles?per_page=12&top=1');

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data.filter(a => a.title && a.user));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load Dev.to articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
          />
          <motion.p 
            className="text-slate-400 font-semibold"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading community articles…
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-200 mb-2">Oops!</h2>
            <p className="text-slate-400">{error}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Dev Community Highlights
          </h1>
          <p className="text-slate-400 text-lg flex items-center gap-2">
            <Zap className="text-amber-400" size={20} />
            Trending articles from developers worldwide
          </p>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {articles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ArticleCard({ article, index }) {
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.2)" }}
      className="block group"
    >
      <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm">
        
        {/* Cover Image */}
        {article.cover_image && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
            <motion.img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-5 space-y-4">
          
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <motion.img
              src={article.user.profile_image}
              alt={article.user.name}
              className="w-10 h-10 rounded-full border border-slate-600 object-cover"
              whileHover={{ scale: 1.1 }}
            />
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate group-hover:text-indigo-400 transition-colors">
                {article.user.name}
              </p>
              <p className="text-slate-400 text-xs">
                {formatTime(article.published_timestamp)}
              </p>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {article.title}
          </h3>

          {/* Tags */}
          {article.tag_list.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tag_list.slice(0, 3).map(tag => (
                <motion.span
                  key={tag}
                  className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-md border border-indigo-500/20 flex items-center gap-1"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                >
                  <Tag size={12} />
                  {tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Metrics */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-700/50">
            <motion.div 
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Heart size={16} />
              <span className="text-sm font-medium">{article.public_reactions_count}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <MessageCircle size={16} />
              <span className="text-sm font-medium">{article.comments_count}</span>
            </motion.div>
            <div className="ml-auto">
              <motion.div
                whileHover={{ x: 3 }}
              >
                <ExternalLink size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default DevCommunityFeed;
