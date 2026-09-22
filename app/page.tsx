import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('businesses').select('*')

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>NFC Platform — Connection Test</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {!error && <p style={{ color: 'green' }}>✅ Connected to Supabase! Businesses found: {data?.length}</p>}
    </div>
  )
}