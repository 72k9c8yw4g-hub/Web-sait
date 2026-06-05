import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'

const MAX_HISTORY = 10 // Updated: 1780641343
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import Analytics from './components/Analytics'
import './App.css'

const firebaseConfig = {
  apiKey: "AIzaSyAQJT2UM5GXAwGYrxNSaHDN-Cb2KnAyQ8U",
  authDomain: "pokeca-app-cf7e3.firebaseapp.com",
  projectId: "pokeca-app-cf7e3",
  storageBucket: "pokeca-app-cf7e3.firebasestorage.app",
  messagingSenderId: "249864259838",
  appId: "1:249864259838:web:303a738410d88852affdaf"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [currentScreen, setCurrentScreen] = useState('list')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(data)
    })
    return unsubscribe
  }, [user])

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
    } catch (error) {
      alert('登録エラー: ' + error.message)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
    } catch (error) {
      alert('ログインエラー: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setCurrentScreen('list')
  }

  const handleAddProduct = async (productData) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date(),
        createdBy: user.email,
        updatedAt: new Date()
      })
      setCurrentScreen('list')
    } catch (error) {
      alert('追加エラー: ' + error.message)
    }
  }

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const prevProduct = products.find(p => p.id === id)
      const historyEntry = {
        changedBy: user.email,
        changedAt: new Date(),
        status: updatedData.status,
        result: updatedData.result || '未確認',
        profit: updatedData.profit,
        memo: updatedData.memo || ''
      }
      const newHistory = [...(prevProduct.history || []), historyEntry].slice(-MAX_HISTORY)

      await updateDoc(doc(db, 'products', id), {
        ...updatedData,
        updatedAt: new Date(),
        lastUpdatedBy: user.email,
        history: newHistory
      })
      setEditingId(null)
      setCurrentScreen('list')
    } catch (error) {
      alert('更新エラー: ' + error.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm('削除してもいいですか？')) {
      try {
        await deleteDoc(doc(db, 'products', id))
      } catch (error) {
        alert('削除エラー: ' + error.message)
      }
    }
  }

  if (!user) {
    return (
      <div className="auth-container">
        <h1>🛒 ポケカ物販 意思決定アプリ</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">ログイン</button>
          <button type="button" onClick={handleSignUp} style={{ marginTop: '10px', background: '#888' }}>
            新規登録
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
          ※メールアドレスとパスワードで登録してください
        </p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>🛒 ポケカ物販</h1>
        <div className="user-info">
          <span>{user.email}</span>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </header>

      <nav className="nav">
        <button
          className={currentScreen === 'list' ? 'active' : ''}
          onClick={() => setCurrentScreen('list')}
        >
          一覧
        </button>
        <button
          className={currentScreen === 'add' ? 'active' : ''}
          onClick={() => {
            setCurrentScreen('add')
            setEditingId(null)
          }}
        >
          追加
        </button>
        <button
          className={currentScreen === 'analytics' ? 'active' : ''}
          onClick={() => setCurrentScreen('analytics')}
        >
          分析
        </button>
      </nav>

      <main className="main">
        {currentScreen === 'list' && (
          <ProductList
            products={products}
            onEdit={(id) => {
              setEditingId(id)
              setCurrentScreen('detail')
            }}
            onDelete={handleDeleteProduct}
          />
        )}
        {currentScreen === 'add' && (
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setCurrentScreen('list')}
          />
        )}
        {currentScreen === 'detail' && editingId && (
          <ProductForm
            product={products.find(p => p.id === editingId)}
            onSubmit={(data) => handleUpdateProduct(editingId, data)}
            onCancel={() => setCurrentScreen('list')}
            isEditing
          />
        )}
        {currentScreen === 'analytics' && (
          <Analytics products={products} />
        )}
      </main>
    </div>
  )
}
