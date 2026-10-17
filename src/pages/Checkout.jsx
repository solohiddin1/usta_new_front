import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { t, getUser, getStore, formatPrice } from '../i18n/translations';
import { api, getImageUrl } from '../api/client';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const user = getUser();
  const store = getStore();
  const [submitting, setSubmitting] = useState(false);

  if (!user || !store || !state || !state.products) {
    return (
      <div className="Check">
        <div className="check_up">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="all_name">{t('h_16')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (submitting) return;
    setSubmitting(true);

    const payloadProducts = state.products.map((p) => ({
      product: p.id,
      count: p.quantity,
    }));

    try {
      await api.post(
        `/product/order/${user.chat_id}/`,
        {
          products: payloadProducts,
          store: store.id,
          total: state.total,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Deduct balance locally for display until refreshed
      if (user.summa) {
        user.summa = Math.max(0, user.summa - state.total);
        localStorage.setItem('user', JSON.stringify(user));
      }

      window.location.href = `/?lang=${user.lang || 'ru'}&chatId=${user.chat_id}`;
    } catch (err) {
      console.error('Failed to place order', err);
      alert(user.lang === 'uz' ? 'Buyurtma berishda xatolik yuz berdi!' : 'Ошибка при оформлении заказа!');
      setSubmitting(false);
    }
  };

  return (
    <div className="Check">
      <div className="check_up">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="all_name">{t('h_14')}</div>
            </div>

            <div className="col-12">
              <div className="check_h">
                Region: {user.region}
              </div>
              <div className="check_h">
                Store: {store.name}
              </div>
            </div>

            <div className="col-12">
              {state.products.map((item, idx) => (
                <div className="card_main" key={item.id || idx}>
                  <div className="card_l">
                    <div className="card_l_img">
                      <img
                        src={item.image ? getImageUrl(item.image) : '/img/placeholder.svg'}
                        alt={item.name}
                        className="img"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/img/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="card_l_text">
                      <div className="card_l_h">{item.name}</div>
                      <div className="card_l_p">
                        {formatPrice(item.price)} {t('h_4')}
                      </div>
                    </div>
                  </div>

                  <div className="card_r">
                    <div className="cat_l_2">
                      <div className="cat_num">{item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="check_p">
                {t('h_6')} {formatPrice(state.total)} {t('h_4')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="check_down">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="check_btn_1"
                disabled={submitting}
              >
                {submitting ? '...' : t('h_14')}
              </button>
              <Link to="/cart" className="check_btn_2">
                {t('h_15')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
