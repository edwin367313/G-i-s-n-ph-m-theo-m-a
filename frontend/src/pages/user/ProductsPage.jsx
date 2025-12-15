import React from 'react';
import { useProducts } from '../../hooks/useProduct';
import ProductList from '../../components/product/ProductList';

const ProductsPage = () => {
  const { products, pagination, isLoading } = useProducts({ limit: 12 });

  return (
    <div>
      <h1>Sản phẩm</h1>
      <ProductList
        products={products}
        loading={isLoading}
        pagination={pagination}
        onPageChange={pagination.goToPage}
      />
    </div>
  );
};

export default ProductsPage;
