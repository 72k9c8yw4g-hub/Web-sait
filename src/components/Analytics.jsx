import './Analytics.css'

export default function Analytics({ products }) {
  // 利益分布の計算
  const high = products.filter(p => p.profit >= 500).length
  const medium = products.filter(p => p.profit >= 80 && p.profit < 500).length
  const low = products.filter(p => p.profit < 80).length

  // 買い候補の成功率
  const buyingCandidates = products.filter(p => p.status === '買い候補')
  const successful = buyingCandidates.filter(p => p.result === '成功').length
  const successRate = buyingCandidates.length > 0
    ? Math.round((successful / buyingCandidates.length) * 100)
    : 0

  // 統計情報
  const totalProducts = products.length
  const totalProfit = products.reduce((sum, p) => sum + p.profit, 0)
  const avgProfit = totalProducts > 0 ? Math.round(totalProfit / totalProducts) : 0
  const maxProfit = Math.max(0, ...products.map(p => p.profit))

  return (
    <div className="analytics-container">
      <h2>📊 分析</h2>

      {/* 統計サマリー */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>総商品数</h3>
          <div className="big-number">{totalProducts}</div>
        </div>
        <div className="summary-card">
          <h3>合計利益</h3>
          <div className="big-number" style={{ color: '#2ecc71' }}>
            {totalProfit}円
          </div>
        </div>
        <div className="summary-card">
          <h3>平均利益</h3>
          <div className="big-number">{avgProfit}円</div>
        </div>
        <div className="summary-card">
          <h3>最高利益</h3>
          <div className="big-number" style={{ color: '#3498db' }}>
            {maxProfit}円
          </div>
        </div>
      </div>

      {/* 利益分布 */}
      <div className="chart-section">
        <h3>💰 利益分布</h3>
        <div className="distribution-chart">
          <div className="bar-item">
            <div className="bar-label">
              <span>本命クリア (≥500円)</span>
              <span className="count">{high}件</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{
                  width: `${totalProducts > 0 ? (high / totalProducts) * 100 : 0}%`,
                  backgroundColor: '#2ecc71'
                }}
              />
            </div>
          </div>

          <div className="bar-item">
            <div className="bar-label">
              <span>実験枠クリア (80〜499円)</span>
              <span className="count">{medium}件</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{
                  width: `${totalProducts > 0 ? (medium / totalProducts) * 100 : 0}%`,
                  backgroundColor: '#f39c12'
                }}
              />
            </div>
          </div>

          <div className="bar-item">
            <div className="bar-label">
              <span>基準未達 (&lt;80円)</span>
              <span className="count">{low}件</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{
                  width: `${totalProducts > 0 ? (low / totalProducts) * 100 : 0}%`,
                  backgroundColor: '#e74c3c'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 買い候補の成功率 */}
      <div className="chart-section">
        <h3>✅ 買い候補の成功率</h3>
        <div className="success-rate">
          <div className="rate-number">{successRate}%</div>
          <div className="rate-details">
            {buyingCandidates.length > 0 ? (
              <>
                <p>成功: {successful}件 / 合計: {buyingCandidates.length}件</p>
                <small>※「結果」で「成功」または「失敗」を記録してください</small>
              </>
            ) : (
              <p>買い候補がまだありません</p>
            )}
          </div>
        </div>
      </div>

      {/* ステータス別集計 */}
      <div className="chart-section">
        <h3>📈 ステータス別</h3>
        <div className="status-summary">
          <div className="status-item">
            <span className="status-label">✅ 買い候補</span>
            <span className="status-value">
              {products.filter(p => p.status === '買い候補').length}件
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">⏸️ 保留</span>
            <span className="status-value">
              {products.filter(p => p.status === '保留').length}件
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">❌ 却下</span>
            <span className="status-value">
              {products.filter(p => p.status === '却下').length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
