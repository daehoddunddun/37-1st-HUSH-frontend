import React, { useState, useEffect } from 'react';
import LikeProduct from './LikeProduct';
import '../myPage/Like.scss';

function Like() {
  const [productData, setProductData] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    fetch('http://172.20.10.4:3000/user/like', {
      headers: {
        authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NjQwMDk3ODR9.nvQGE9HLe8n-JCgqqRk3O-2dGEujzQhWIgm0WyCKN60',
      },
    })
      .then(response => response.json())
      .then(data => {
        setProductData(data.likes);
      });
  }, []);

  const handleSingleChecked = e => {
    if (e.target.checked) {
      setCheckedList([...checkedList, Number(e.target.id)]);
    } else if (!e.target.checked) {
      setCheckedList(checkedList.filter(el => el !== Number(e.target.id)));
    }
  };

  const handleAllChecked = e => {
    if (e.target.checked) {
      let newArr = [];
      productData.forEach(el => newArr.push(el.pId));
      setCheckedList(newArr);
    } else {
      setCheckedList([]);
    }
  };

  const deleteChecked = () => {
    fetch(
      `http://172.20.10.4:3000/user/like/deletelike?${checkedQueryString()}`,
      {
        method: 'DELETE',
        headers: {
          authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NjQwMDk3ODR9.nvQGE9HLe8n-JCgqqRk3O-2dGEujzQhWIgm0WyCKN60',
        },
      }
    );
    window.location.reload();
  };

  const checkedQueryString = () => {
    let checkedProducts = '';
    for (let i = 0; i < checkedList.length; i++) {
      checkedProducts += `productId=${checkedList[i]}&`;
    }
    return checkedProducts.slice(0, -1);
  };

  return (
    <div className="like">
      <h1 className="like-title">찜목록</h1>
      <table className="like-product">
        <thead className="like-product-head">
          <tr>
            <th>
              <input
                className="head-checkbox"
                type="checkbox"
                id="checkbox"
                checked={checkedList.length === productData.length}
                onChange={handleAllChecked}
              />
              <label htmlFor="checkbox" />
            </th>
            <th className="head-text-info">제품 정보</th>
            <th className="head-text">금액</th>
            <th className="head-text">선택</th>
          </tr>
        </thead>
        <tbody className="like-product-body">
          {productData.map(product => (
            <LikeProduct
              key={product.productId}
              id={product.productId}
              img={product.thumbnail_image_url}
              name={product.productName}
              category={product.categoryName}
              price={product.price}
              handleSingleChecked={handleSingleChecked}
              checkedList={checkedList}
            />
          ))}
        </tbody>
      </table>
      {productData.length < 1 && (
        <div className="product-empty">
          <img className="empty-img" src="/images/like/sad.png" alt="아이콘" />
          <p className="empty-text">아직 찜한 상품이 없네요!</p>
        </div>
      )}
      {productData.length > 0 && (
        <button className="like-delete-btn" onClick={deleteChecked}>
          선택 삭제
        </button>
      )}
    </div>
  );
}

export default Like;
