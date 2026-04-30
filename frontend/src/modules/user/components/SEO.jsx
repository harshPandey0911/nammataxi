import { useEffect } from 'react';
import api from '../../../lib/api';

const SEO = ({ pageName }) => {
    useEffect(() => {
        const fetchSEO = async () => {
            if (!pageName) return;
            try {
                const res = await api.get(`/seo/page/${pageName}`);
                if (res && res.data) {
                    const { title, keywords, description } = res.data;
                    
                    // Update Title
                    if (title) {
                        document.title = title;
                    }

                    // Update Keywords Meta Tag
                    if (keywords) {
                        let metaKeywords = document.querySelector('meta[name="keywords"]');
                        if (!metaKeywords) {
                            metaKeywords = document.createElement('meta');
                            metaKeywords.name = 'keywords';
                            document.head.appendChild(metaKeywords);
                        }
                        metaKeywords.content = keywords;
                    }

                    // Update Description Meta Tag
                    if (description) {
                        let metaDesc = document.querySelector('meta[name="description"]');
                        if (!metaDesc) {
                            metaDesc = document.createElement('meta');
                            metaDesc.name = 'description';
                            document.head.appendChild(metaDesc);
                        }
                        metaDesc.content = description;
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch SEO for ${pageName}:`, error);
            }
        };

        fetchSEO();
    }, [pageName]);

    return null; // This component doesn't render anything
};

export default SEO;
