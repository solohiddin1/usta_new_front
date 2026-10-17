import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { t, getUser } from '../i18n/translations';
import { getImageUrl } from '../api/client';

export default function Subcategories() {
  const location = useLocation();
  const state = location.state;
  const user = getUser();
  const [openAccordion, setOpenAccordion] = useState('');

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) => (prev === String(id) ? '' : String(id)));
  };

  if (!user || !state) {
    return (
      <div className="Home">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="h_name">{t('h_16')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backUrl = `/?lang=${user.lang || 'ru'}&chatId=${user.chat_id}`;

  return (
    <div className="Home">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex align-items-center">
            <Link className="all_back" to={backUrl}>
              <img src="/img/icon_back.png" alt="Back" />
            </Link>
            <div className="h_name">{state.parent}</div>
          </div>

          <div className="accordion">
            {Array.isArray(state.category) &&
              state.category.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0;
              const itemIdStr = String(item.id || idx);
              const isOpen = openAccordion === itemIdStr;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.id || idx}
                    state={{ category: item }}
                    to={`/products/${item.id}`}
                    className="h_l"
                  >
                    <div className="tech_h">{item.name}</div>
                    {item.icon && (
                      <img
                        src={getImageUrl(item.icon)}
                        alt=""
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </Link>
                );
              }

              return (
                <div className="accordion-item" key={item.id || idx}>
                  <h2 className="accordion-header">
                    <button
                      type="button"
                      className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                      onClick={() => toggleAccordion(item.id || idx)}
                    >
                      <div className="h_l_3">
                        {item.icon && (
                          <img
                            src={getImageUrl(item.icon)}
                            alt=""
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="tech_h">{item.name}</div>
                      </div>
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <div className="accordion-body">
                      {item.children.map((child, cIdx) => (
                        <Link
                          key={child.id || cIdx}
                          state={{ category: child }}
                          to={`/products/${child.id}`}
                          className="tech_p"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
