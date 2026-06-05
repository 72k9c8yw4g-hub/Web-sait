import { useState, useEffect } from 'react'
import './ProductForm.css'

export default function ProductForm({ product, onSubmit, onCancel, isEditing }) {
  const [name, setName] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [cost, setCost] = useState(420)
  const [frame, setFrame] = useState('本命')
  const [status, setStatus] = useState('保留')
  const [memo, setMemo] = useState('')
  const [tradingHistory, setTradingHistory] = useState(false)
  const [result, setResult] = useState('未確認')

  useEffect(() => {
    if (product && isEditing) {
      setName(product.name)
      setPurchasePrice(product.purchasePrice)
      setSellingPrice(product.sellingPrice)
      setCost(product.cost)
      setFrame(product.frame)
      setStatus(product.status)
      setMemo(product.memo || '')
      setTradingHistory(product.tradingHistory || false)
      setResult(product.result || '未確認')
    }
  }, [product, isEditing])

  const formatHistoryDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const profit = sellingPrice ? parseInt(sellingPrice) - parseInt(purchasePrice) - cost : 0
  const threshold = frame === '本命' ? 500 : 80
  const meetsCriteria = profit >= threshold

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      purchasePrice: parseInt(purchasePrice),
      sellingPrice: parseInt(sellingPrice),
      cost: parseInt(cost),
      profit,
      frame,
      status,
      result,
      memo,
      tradingHistory
    })
  }

  return (
    <div className="product-form-container">
      <h2>{isEditing ? '商品を編集' : '新しい商品を追加'}</h2>

      <form onSubmit={handleSubmit} className="product-form">
        {/* 商品名 */}
        <div className="form-group">
          <label htmlFor="name">商品名 *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: ポケモンカード 151 1BOX"
            required
          />
        </div>

        {/* 仕入れ価格 */}
        <div className="form-group">
          <label htmlFor="purchase">仕入れ価格 *</label>
          <input
            id="purchase"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="0"
            required
          />
          {purchasePrice > 4000 && (
            <div className="warning">⚠️ 仕入れ上限4000円を超えています</div>
          )}
        </div>

        {/* 想定売値 */}
        <div className="form-group">
          <label htmlFor="selling">想定売値 *</label>
          <input
            id="selling"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        {/* コスト（折りたたみ可能） */}
        <details className="cost-details">
          <summary>手数料・送料を変更</summary>
          <div className="form-group">
            <label htmlFor="cost">コスト（デフォルト: 420円）</label>
            <input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value))}
              placeholder="420"
            />
          </div>
        </details>

        {/* 計算結果の表示 */}
        <div className="calculation-result">
          <div className="profit-display">
            <h3>純利益</h3>
            <div className="profit-value" style={{
              color: profit >= 500 ? '#2ecc71' : profit >= 80 ? '#f39c12' : '#e74c3c'
            }}>
              {profit}円
            </div>
          </div>

          <div className="criteria-display">
            <div className="frame-select">
              <label>枠:</label>
              <select value={frame} onChange={(e) => setFrame(e.target.value)}>
                <option value="本命">本命 (≥500円)</option>
                <option value="実験枠">実験枠 (≥80円)</option>
              </select>
            </div>
            <div className="criteria-check">
              {meetsCriteria ? (
                <span className="badge-ok">✅ 基準クリア</span>
              ) : (
                <span className="badge-warn">⚠️ 基準未達</span>
              )}
            </div>
          </div>
        </div>

        {/* ステータス */}
        <div className="form-group">
          <label htmlFor="status">判断</label>
          <div className="status-buttons">
            <button
              type="button"
              className={`status-btn ${status === '買い候補' ? 'active' : ''}`}
              onClick={() => setStatus('買い候補')}
            >
              ✅ 買い候補
            </button>
            <button
              type="button"
              className={`status-btn ${status === '保留' ? 'active' : ''}`}
              onClick={() => setStatus('保留')}
            >
              ⏸️ 保留
            </button>
            <button
              type="button"
              className={`status-btn ${status === '却下' ? 'active' : ''}`}
              onClick={() => setStatus('却下')}
            >
              ❌ 却下
            </button>
          </div>
        </div>

        {/* メモ */}
        <div className="form-group">
          <label htmlFor="memo">理由メモ</label>
          <textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例: メルカリで人気、取引実績あり"
            rows="3"
          />
        </div>

        {/* 結果記録（編集時のみ） */}
        {isEditing && (
          <div className="form-group">
            <label>結果</label>
            <div className="result-buttons">
              <button
                type="button"
                className={`result-btn result-success ${result === '成功' ? 'active' : ''}`}
                onClick={() => setResult('成功')}
              >
                ✅ 成功
              </button>
              <button
                type="button"
                className={`result-btn result-failure ${result === '失敗' ? 'active' : ''}`}
                onClick={() => setResult('失敗')}
              >
                ❌ 失敗
              </button>
              <button
                type="button"
                className={`result-btn result-pending ${result === '未確認' ? 'active' : ''}`}
                onClick={() => setResult('未確認')}
              >
                ❓ 未確認
              </button>
            </div>
          </div>
        )}

        {/* 取引実績 */}
        <div className="form-group checkbox-group">
          <label htmlFor="trading">
            <input
              id="trading"
              type="checkbox"
              checked={tradingHistory}
              onChange={(e) => setTradingHistory(e.target.checked)}
            />
            取引実績あり
          </label>
        </div>

        {/* 変更履歴（編集時のみ） */}
        {isEditing && product?.history && product.history.length > 0 && (
          <details className="history-details">
            <summary>変更履歴 ({product.history.length}件)</summary>
            <div className="history-list">
              {[...product.history].reverse().map((h, i) => (
                <div key={i} className="history-item">
                  <span className="history-who">{h.changedBy}</span>
                  <span className="history-when">{formatHistoryDate(h.changedAt)}</span>
                  <span className="history-status">{h.status}</span>
                  {h.result && h.result !== '未確認' && (
                    <span className={`history-result ${h.result === '成功' ? 'success' : 'failure'}`}>
                      {h.result === '成功' ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </details>
        )}

        {/* ボタン */}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {isEditing ? '保存' : '追加'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
