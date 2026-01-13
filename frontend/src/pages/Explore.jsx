import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';

// Dev.to Public Articles API
const DEV_TO_API_URL = 'https://dev.to/api/articles?per_page=10&top=1';

function DevCommunityFeed() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(DEV_TO_API_URL);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Filter valid articles only
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

  const styles = {
    container: {
      maxWidth: '850px',
      margin: '0 auto',
      padding: '20px 15px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
    },
    articleCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '10px',
      cursor: 'pointer',
    },
    contentArea: { padding: '16px' },
    coverImage: {
      width: '100%',
      maxHeight: '200px',
      objectFit: 'cover',
      borderRadius: '8px 8px 0 0',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    profileImage: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      marginRight: '8px',
    },
    metaText: {
      fontSize: '0.85em',
      color: '#717171',
    },
    title: {
      fontSize: '1.5em',
      fontWeight: '700',
      color: '#090909',
      marginBottom: '10px',
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: '10px',
    },
    tag: {
      fontSize: '0.8em',
      color: '#3b49df',
      marginRight: '8px',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#f2f5ff',
    },
    metrics: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '10px',
      borderTop: '1px solid #e5e5e5',
      fontSize: '0.85em',
      color: '#575757',
    },
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h2 style={{ textAlign: 'center' }}>⚙️ Loading Dev.to Posts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>
        Dev Community – Trending Today
      </h1>

      {articles.map(article => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div style={styles.articleCard}>
            {article.cover_image && (
              <img
                src={article.cover_image}
                alt={article.title}
                style={styles.coverImage}
              />
            )}

            <div style={styles.contentArea}>
              <div style={styles.userInfo}>
                <img
                  src={article.user.profile_image}
                  alt={article.user.name}
                  style={styles.profileImage}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>
                    {article.user.name}
                  </div>
                  <div style={styles.metaText}>
                    Published on {formatTime(article.published_timestamp)}
                  </div>
                </div>
              </div>

              <div style={styles.title}>{article.title}</div>

              <div style={styles.tagContainer}>
                {article.tag_list.slice(0, 4).map(tag => (
                  <div key={tag} style={styles.tag}>#{tag}</div>
                ))}
              </div>

              <div style={styles.metrics}>
                <div>💖 {article.public_reactions_count} Reactions</div>
                <div>💬 {article.comments_count} Comments</div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default DevCommunityFeed;
