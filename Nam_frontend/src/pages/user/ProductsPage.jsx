import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Space, Tag, Button } from 'antd';
import { FireOutlined, ReloadOutlined } from '@ant-design/icons';
import { useProducts } from '../../hooks/useProduct';
import ProductList from '../../components/product/ProductList';
import { getSeasonalProducts, getCurrentSeasonInfo } from '../../services/recommendationService';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const seasonFilter = searchParams.get('season') || '';
  
  const { products, pagination, isLoading, updateFilters } = useProducts({ limit: 12 });
  const [currentSeason, setCurrentSeason] = useState(null);
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [loadingSeasonal, setLoadingSeasonal] = useState(false);

  useEffect(() => {
    fetchCurrentSeason();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      updateFilters({ search: searchQuery });
    } else if (seasonFilter) {
      // Load seasonal products
      loadSeasonalProducts(seasonFilter);
    } else {
      updateFilters({ search: '' });
    }
  }, [searchQuery, seasonFilter]);

  const fetchCurrentSeason = async () => {
    try {
      const response = await getCurrentSeasonInfo();
      if (response.success) {
        setCurrentSeason(response.data.currentSeason);
      }
    } catch (error) {
      console.error('Error fetching current season:', error);
    }
  };

  const loadSeasonalProducts = async (season) => {
    try {
      setLoadingSeasonal(true);
      const response = await getSeasonalProducts(season, 50);
      if (response.success) {
        setSeasonalProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error loading seasonal products:', error);
    } finally {
      setLoadingSeasonal(false);
    }
  };

  const handleSeasonChange = (season) => {
    if (season === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ season });
    }
  };

  const seasons = ['Xuân', 'Hạ', 'Thu', 'Đông'];

  const tabItems = [
    {
      key: 'all',
      label: 'Tất cả sản phẩm',
      children: (
        <ProductList
          products={products}
          loading={isLoading}
          pagination={pagination}
          onPageChange={pagination.goToPage}
        />
      )
    },
    ...seasons.map(season => ({
      key: season,
      label: (
        <Space>
          {season}
          {currentSeason === season && (
            <Tag color="green"><FireOutlined /> Hot</Tag>
          )}
        </Space>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Tag color="blue">Sản phẩm mùa {season}</Tag>
              <span style={{ color: '#666' }}>
                {seasonalProducts.length} sản phẩm
              </span>
            </Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => loadSeasonalProducts(season)}
              loading={loadingSeasonal}
            >
              Tải lại
            </Button>
          </div>
          <ProductList
            products={seasonalProducts.map(p => ({
              id: p.ProductName,
              name: p.ProductName,
              purchases: p.PurchaseCount,
              customers: p.CustomerCount,
              score: p.PopularityScore
            }))}
            loading={loadingSeasonal}
            showSeasonalInfo={true}
          />
        </div>
      )
    }))
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: 24 }}>
        {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Sản phẩm'}
      </h1>
      
      {!searchQuery && (
        <Tabs
          activeKey={seasonFilter || 'all'}
          items={tabItems}
          onChange={handleSeasonChange}
          size="large"
        />
      )}

      {searchQuery && (
        <ProductList
          products={products}
          loading={isLoading}
          pagination={pagination}
          onPageChange={pagination.goToPage}
        />
      )}
    </div>
  );
};

export default ProductsPage;
