import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { t, getUser } from '../i18n/translations';
import { api, getImageUrl } from '../api/client';

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const category = location.state?.category;

  const [product, setProduct] = useState({});
  const [count, setCount] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => (c > 1 ? c - 1 : 1));

  useEffect(() => {
    if (user && id) {
      api.get(`/product/${id}/${user.chat_id}/`)
        .then((res) => {
          setProduct(res.data);
          if (res.data.has_in_cart) {
            setAdded(true);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch product detail', err);
        });
    }
  }, [id, user?.chat_id]);

  const isInCart = product.has_in_cart || added;

  const addToCart = async () => {
    if (!product.id || loading) return;

    if (isInCart) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      await api.post(
        `/product/my-cart/${user.chat_id}/`,
        { product: product.id, count },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAdded(true);
      setProduct((prev) => ({ ...prev, has_in_cart: true }));
      navigate('/cart');
    } catch (err) {
      console.error('Failed to add to cart', err);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !category) {
    return (
      <div className="Category">
        <div className="cat_up">
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

  const backUrl = `/products/${category.id}`;

  return (
    <div className="Category">
      <div className="cat_up">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Link className="all_back" state={{ category }} to={backUrl}>
                <img src="/img/icon_back.png" alt="Back" />
              </Link>
            </div>

            <div className="col-12">
              <div className="all_name">{product.name}</div>
            </div>

            <div className="col-12">
              <div className="cat_img">
                {product.images && product.images.length > 0 ? (
                  <Swiper
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    navigation={product.images.length > 1}
                    loop={product.images.length > 1}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                  >
                    {product.images.map((img, idx) => (
                      <SwiperSlide key={img.id || idx}>
                        <img
                          src={getImageUrl(img.image)}
                          alt={product.name}
                          style={{ objectFit: 'contain', maxHeight: 350 }}
                          onError={(e) => {
                            e.target.src = '/img/placeholder.svg';
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img
                    src="/img/placeholder.svg"
                    alt={product.name}
                    style={{ width: '100%', height: 260, objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: 12 }}
                  />
                )}
              </div>

              <div className="cat_info">
                <div className="cat_l">
                  <div className="cat_info_h">{product.name}</div>
                </div>
                <div className="d-flex">
                  <div className="cat_r">
                    <div className="cat_r_h">{t('h_5')}</div>
                    <div className="cat_r_p">
                      {product.price} <span>{t('h_4')}</span>
                    </div>
                    <div className="cat_r_h bonus">{t('h_3')}</div>
                    <div className="cat_r_p bonus">
                      {product.bonus} {t('h_4')}
                    </div>
                  </div>
                </div>
              </div>

              {product.description && (
                <div className="cat_desct">
                  {product.description.split(/\r\n|\n/).map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}

              <div className="cat_info">
                <div className="cat_l_2">
                  <div
                    className={count > 1 ? 'cat_min_active' : 'cat_min'}
                    onClick={decrement}
                  />
                  <div className="cat_num">{count}</div>
                  <div className="cat_plus" onClick={increment} />
                </div>
                <div className="cat_r">
                  <div className="cat_r_h">{t('h_6')}</div>
                  <div className="cat_r_p">
                    {(product.price || 0) * count} {t('h_4')}
                  </div>
                </div>
              </div>

              <div className="cat_bonus">
                <div className="cat_h">{t('h_7')}</div>
                <div className="cat_p">
                  {user.summa || 0} {t('h_4')}
                </div>
              </div>

              {isInCart && <div className="cat_text">{t('h_13')}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="cat_down">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                onClick={addToCart}
                className="cat_buy"
              >
                {isInCart ? (user.lang === 'uz' ? 'Savatchaga o\'tish' : 'В корзину') : t('h_8')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
