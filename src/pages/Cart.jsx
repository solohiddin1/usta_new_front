import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { t, getUser, getStore } from '../i18n/translations';
import { api, getImageUrl } from '../api/client';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const user = getUser();
  const store = getStore();

  const fetchCart = () => {
    if (!user) return;
    api.get(`/product/my-cart/${user.chat_id}/`)
      .then((res) => {
        const items = res.data.map((x) => ({
          ...x,
          quantity: x.count,
          image: x.image ? getImageUrl(x.image) : '/img/placeholder.svg',
        }));
        setCartItems(items);
      })
      .catch((err) => {
        console.error('Failed to fetch cart', err);
      });
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user?.chat_id]);

  const updateQuantity = async (productId, newQuantity) => {
    const prevItems = cartItems;
    setCartItems((prev) =>
      newQuantity > 0
        ? prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
        : prev.filter((item) => item.id !== productId)
    );

    try {
      if (newQuantity > 0) {
        await api.patch(`/product/my-cart/${user.chat_id}/${productId}/`, { count: newQuantity });
      } else {
        await api.delete(`/product/my-cart/${user.chat_id}/${productId}/`);
      }
    } catch (err) {
      console.error('Failed to update cart', err);
      setCartItems(prevItems);
    }
  };

  const handleIncrement = (id) => {
    const item = cartItems.find((x) => x.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const handleDecrement = (id) => {
    const item = cartItems.find((x) => x.id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  const totalSum = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutClick = (e) => {
    if (cartItems.length === 0) {
      e.preventDefault();
      return;
    }

    if (!store) {
      e.preventDefault();
      const msg = user.lang === 'uz'
        ? "Iltimos, avval do'konni tanlang!"
        : "Пожалуйста, сначала выберите магазин!";
      alert(msg);
      return;
    }

    if (totalSum > (user.summa || 0)) {
      e.preventDefault();
      const msg = user.lang === 'uz'
        ? "Bonus summangiz buyurtmani jami summasidan katta bulishi kerak!"
        : "Сумма вашего бонуса должна быть больше, чем общая сумма заказа!";
      alert(msg);
      return;
    }
  };

  if (!user) {
    return (
      <div className="Card">
        <div className="card_up">
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

  const backUrl = `/?lang=${user.lang || 'ru'}&chatId=${user.chat_id}`;

  return (
    <div className="Card">
      <div className="card_up">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex align-items-center">
              <Link className="all_back" to={backUrl}>
                <img src="/img/icon_back.png" alt="Back" />
              </Link>
              <div className="all_name">{t('h_2')}</div>
            </div>

            {store ? (
              <div className="col-12">
                <div className="card_name">
                  <img src="/img/icon_loc_2.png" alt="" />
                  <span style={{ marginLeft: 8 }}>{store.name}</span>
                </div>
                <Link to="/map" className="card_acc_buy">
                  <img src="/img/icon_loc_1.png" alt="" />
                  <span>{t('h_9')}</span>
                </Link>
              </div>
            ) : (
              <div className="col-12">
                <Link to="/map" className="card_acc_buy">
                  <img src="/img/icon_loc_1.png" alt="" />
                  <span>{t('h_9')}</span>
                </Link>
              </div>
            )}

            <div className="col-12">
              {cartItems.map((item) => (
                <div className="card_main" key={item.id}>
                  <div className="card_l">
                    <div className="card_l_img">
                      <img
                        src={item.image || '/img/placeholder.svg'}
                        alt={item.name}
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/img/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="card_l_text">
                      <div className="card_l_h">{item.name}</div>
                      <div className="card_l_p">
                        {t('h_5')} {item.price} {t('h_4')}
                      </div>
                    </div>
                  </div>

                  <div className="card_r">
                    <div className="cat_l_2">
                      <button
                        type="button"
                        onClick={() => handleDecrement(item.id)}
                        className="cat_min"
                      >
                        -
                      </button>
                      <div className="cat_num">{item.quantity}</div>
                      <button
                        type="button"
                        onClick={() => handleIncrement(item.id)}
                        className="cat_plus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card_down">
        <div className="container">
          <div className="card_down_text">
            <div className="card_down_h">
              {t('h_6')} {totalCount}
            </div>
            <div className="card_down_p">
              {totalSum} <span>{t('h_4')}</span>
            </div>
          </div>

          <Link
            to="/check"
            state={{ products: cartItems, total: totalSum }}
            onClick={handleCheckoutClick}
            className={`card_l ${cartItems.length === 0 ? 'disabled-link' : ''}`}
            style={cartItems.length === 0 ? { pointerEvents: 'none', opacity: 0.6 } : {}}
          >
            {t('h_10')}
          </Link>
        </div>
      </div>
    </div>
  );
}
