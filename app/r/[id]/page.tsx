'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ReviewPage() {
  const params = useParams()
  const businessId = params.id as string

  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single()
      setBusiness(data)
      setLoading(false)
    }
    loadBusiness()
  }, [businessId])

  async function handleSubmit() {
    await supabase.from('feedback').insert({
      business_id: businessId,
      rating: rating,
      comment: comment,
    })
    setSubmitted(true)
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>
  if (!business) return <div style={{ padding: 40 }}>Business not found.</div>

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 30, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>{business.name}</h1>
      <p style={{ fontSize: 18, marginBottom: 20 }}>{business.custom_question}</p>

      {!submitted ? (
        <>
          <div style={{ fontSize: 40, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer', color: star <= rating ? '#FFD700' : '#ccc' }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Tell us more about your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: '100%', minHeight: 100, padding: 10, marginBottom: 20 }}
          />

          <div>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              style={{ padding: '12px 24px', fontSize: 16, marginBottom: 12, width: '100%' }}
            >
              Submit Feedback
            </button>
          </div>

          <a href={business.google_review_url} target="_blank" style={{ fontSize: 14, color: '#555' }}>
            Leave a Google Review
          </a>
        </>
      ) : (
        <div>
          <p style={{ fontSize: 20 }}>Thank you for your feedback!</p>
          {rating >= 4 ? (
            <a href={business.google_review_url} target="_blank" style={{ display: 'inline-block', marginTop: 20, padding: '12px 24px', background: '#4285F4', color: 'white', borderRadius: 6, textDecoration: 'none' }}>
              Leave us a Google Review
            </a>
          ) : (
            <p style={{ marginTop: 20 }}>
              <a href={business.google_review_url} target="_blank" style={{ fontSize: 14, color: '#555' }}>
                You can also leave a Google Review
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}