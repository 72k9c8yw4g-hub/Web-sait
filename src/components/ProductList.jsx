import { useState } from 'react'
import './ProductList.css'

export default function ProductList({ products, onEdit, onDelete }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('profit')

  const filteredProducts = products.filter(p => {
    if (filterStatus === 'all') return true
    return p.status === filterStatus
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'profit') return b.profit - a.profit
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'ja')
    return b.createdAt - a.createdAt
  })

  const getStatusBadge = (status) => {
    const badges = {
      '買い候補': '✅',
      '保留': '⏸️',
      '却下': '❌'
    }
    return badges[status] || '❓'
  }

  const getCriteriaStatus = (profit, frame) => {
    const threshold = frame === '本命' ? 500 : 80
    return profit >= threshold ? '✅' : '⚠️'
  }

  const getProfitColor = (profit) => {
    if (profit >= 500) return '#2ecc71'
    if (profit >= 80) return '#f39c12'
    return '#e74c3c'
  }

  return (
    <div className="product-list">
      <div className="filter-bar">
        <div className="filter-group">
          <label>ステータス:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">すべて</option>
            <option value="買い候補">買い候補</option>
            <option value="保留">保留</option>
            <option value="却下">却下</option>
          </select>
        </div>

        <div className="filter-group">
          <label>ソート:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="profit">利益(高い順)</option>
            <option value="name">商品名</option>
            <option value="recent">最新</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="empty-message">商品がありません</p>
      ) : (
        <div className="products-container">
          {sortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-header">
                <div className="title-section">
                  <h3>{product.name}</h3>
                  <span className="status-badge">
                    {getStatusBadge(product.status)}
                  </span>
                  {product.result && product.result !== '未確認' && (
                    <span className={`result-badge ${product.result === '成功' ? 'result-success' : 'result-failure'}`}>
                      {product.result === '成功' ? '✅ 成功' : '❌ 失敗'}
                    </span>
                  )}
                </div>
                <div className="criteria">
                  {getCriteriaStatus(product.profit, product.frame)}
                  {product.frame}
                </div>
              </div>

              <div className="card-body">
                <div className="price-info">
                  <div className="price-row">
                    <span>仕入れ:</span>
                    <span className="price">{product.purchasePrice}円</span>
                  </div>
                  <div className="price-row">
                    <span>売値:</span>
                    <span className="price">{product.sellingPrice}円</span>
                  </div>
                  <div className="price-row">
                    <span>コスト:</span>
                    <span className="price">{product.cost}円</span>
                  </div>
                  <div className="price-row profit-row">
                    <span>純利益:</span>
                    <span
                      className="profit"
                      style={{ color: getProfitColor(product.profit) }}
                    >
                      {product.profit}円
                    </span>
                  </div>
                </div>

                {product.memo && (
                  <div className="memo">
                    <strong>メモ:</strong> {product.memo}
                  </div>
                )}

                {product.tradingHistory && (
                  <div className="badge">取引実績あり</div>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(product.id)}
                >
                  編集
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(product.id)}
                >
                  削除
                </button>
              </div>

              <div className="card-meta">
                <small>入力者: {product.createdBy}</small>
                {product.lastUpdatedBy && product.lastUpdatedBy !== product.createdBy && (
                  <small>更新: {product.lastUpdatedBy}</small>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
