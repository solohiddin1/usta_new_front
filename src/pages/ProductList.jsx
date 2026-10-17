import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { t, getUser, formatPrice } from '../i18n/translations';
import { api, getImageUrl } from '../api/client';

export default function ProductList() {
  const { id } = useParams();
  const location = useLocation();
  const user = getUser();
  const category = location.state?.category;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user && id) {
      api.get(`/product/products/${id}/${user.chat_id}/`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setProducts(res.data);
          } else {
            console.error('Invalid products response:', res.data);
            setProducts([]);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch products', err);
          setProducts([]);
        });
    }
  }, [id, user?.chat_id]);

  if (!user || !category) {
    return (
      <div className="Prod">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="pr_name">{t('h_16')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backUrl = `/?lang=${user.lang || 'ru'}&chatId=${user.chat_id}`;

  return (
    <div className="Prod">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Link className="all_back" to={backUrl}>
              <img src="/img/icon_back.png" alt="Back" />
            </Link>
          </div>

          <div className="col-12">
            <div className="pr_name">{category.name}</div>
          </div>

          <div className="col-12">
            {Array.isArray(products) &&
              products.map((prod) => {
              const rawImg = prod.images && prod.images.length > 0 ? prod.images[0].image : '';
              const mainImage = rawImg ? getImageUrl(rawImg) : '/img/placeholder.svg';
              return (
                <Link
                  key={prod.id}
                  state={{ category }}
                  to={`/product/${prod.id}`}
                  className="pr_box"
                >
                  <div className="pr_l">
                    <img
                      src={mainImage}
                      alt={prod.name}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/img/placeholder.svg';
                      }}
                    />
                    <div className="pr_img_info">
                      <div className="pr_img_h">{prod.name}</div>
                      <div className="pr_img_h_2">{t('h_3')}</div>
                      <div className="pr_img_h_3">{formatPrice(prod.bonus)} {t('h_4')}</div>
                    </div>
                  </div>

                  <div className="pr_r">
                    <div className="pr_r_text">
                      <div className="pr_r_h">{t('h_5')}</div>
                      <div className="pr_r_p">
                        <span className="price_val">{formatPrice(prod.price)}</span>
                        <span className="price_unit">{t('h_4')}</span>
                      </div>
                    </div>
                    <div className={prod.has_in_cart ? 'pr_r_img_2' : 'pr_r_img'}>
                      <img
                        src={prod.has_in_cart ? '/img/cart_red.svg' : '/img/icon_buy.svg'}
                        alt="Cart"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
