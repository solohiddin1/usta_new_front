import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { t, getUser } from '../i18n/translations';
import { api, getImageUrl } from '../api/client';

export default function Catalog() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get('chatId');
  const lang = searchParams.get('lang');

  const [status, setStatus] = useState('loading');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    localStorage.setItem('store', null);
    if (lang) {
      localStorage.setItem('lang', lang);
    }

    const initUser = async () => {
      const storedUser = getUser();
      if (!storedUser || (chatId && String(storedUser.chat_id) !== String(chatId))) {
        localStorage.removeItem('user');
      }

      if (!chatId && !storedUser) {
        setStatus('error');
        return;
      }

      const activeChatId = chatId || (storedUser && storedUser.chat_id);
      try {
        const res = await api.get(`/user/${activeChatId}`);
        // Ensure valid JSON object response with chat_id
        if (res.data && typeof res.data === 'object' && (res.data.chat_id || res.data.id)) {
          localStorage.setItem('user', JSON.stringify(res.data));
          setStatus('ready');
        } else {
          console.error('Invalid user API response:', res.data);
          if (!storedUser) {
            setStatus('error');
          } else {
            setStatus('ready');
          }
        }
      } catch (err) {
        console.error('Failed to load user', err);
        if (!storedUser) {
          localStorage.removeItem('user');
          setStatus('error');
        } else {
          setStatus('ready');
        }
      }
    };

    initUser();
  }, [chatId, lang]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/product/categories/');
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error('Invalid categories response (expected array):', res.data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [lang]);

  if (status === 'error') {
    return (
      <div className="Tech">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="all_name">{t('h_16')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Tech">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex align-items-center justify-content-between">
            <div className="all_name">{t('h_1')}</div>
          </div>

          <div className="col-12">
            {Array.isArray(categories) &&
              categories.map((cat, idx) => (
                <div className="col-12" key={cat.id || idx}>
                  <Link
                    to="/subs"
                    state={{ category: cat.sub_categories, parent: cat.name }}
                    className="h_l"
                  >
                    <div className="h_l_name">{cat.name}</div>
                    {cat.icon && (
                      <img
                        src={getImageUrl(cat.icon)}
                        alt={cat.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </Link>
                </div>
              ))}
          </div>

          <div className="col-12">
            <Link to="/cart" className="h_l_2">
              <div className="h_l_name_2">{t('h_2')}</div>
              <div className="h_l_2_img">
                <img src="/img/icon_buy.svg" alt="Cart" className="h_l_2_img_2" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
