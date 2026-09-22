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
  const [hoverRating, setHoverRating] = useState(0)
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

    if (rating >= 4) {
      window.location.href = business.google_review_url
    } else {
      setSubmitted(true)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>Loading...</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>Business not found.</div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {business.logo_url && (
          <img src={business.logo_url} alt={business.name} style={styles.logo} />
        )}
                <h1 style={styles.businessName}>{business.name}</h1>
        {!submitted && <p style={styles.question}>{business.custom_question}</p>}

        {!submitted ? (
          <>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    ...styles.star,
                    color: star <= (hoverRating || rating) ? '#FFB800' : '#E0E0E0',
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Tell us more about your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
            />

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              style={{
                ...styles.submitButton,
                opacity: rating === 0 ? 0.5 : 1,
                cursor: rating === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Submit Feedback
            </button>

            <a href={business.google_review_url} target="_blank" style={styles.subtleLink}>
              Leave a Google Review
            </a>
          </>
        ) : (
          <div style={styles.thankYou}>
            <div style={styles.checkmark}>✓</div>
            <p style={styles.thankYouText}>Thank you for your feedback!</p>
            {rating >= 4 ? (
              <a href={business.google_review_url} target="_blank" style={styles.googleButton}>
                Leave us a Google Review
              </a>
            ) : (
              <a href={business.google_review_url} target="_blank" style={styles.subtleLink}>
                You can also leave a Google Review
              </a>
            )}
          </div>
        )}

        <p style={styles.poweredBy}>Powered by your business platform</p>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: '#F5F6F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '40px 30px',
    maxWidth: 420,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  logo: {
    maxWidth: 120,
    maxHeight: 120,
    objectFit: 'contain',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1A1A1A',
    margin: '0 0 8px 0',
  },
  question: {
    fontSize: 16,
    color: '#666',
    margin: '0 0 24px 0',
  },
  stars: {
    fontSize: 44,
    marginBottom: 20,
    lineHeight: 1,
  },
  star: {
    cursor: 'pointer',
    padding: '0 4px',
    transition: 'color 0.15s',
  },
    textarea: {
    width: '100%',
    minHeight: 90,
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    border: '1px solid #DDD',
    fontSize: 15,
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    color: '#1A1A1A',
    background: '#FFFFFF',
    colorScheme: 'light',
  },
  submitButton: {
    width: '100%',
    padding: '14px 0',
    fontSize: 16,
    fontWeight: 600,
    color: '#FFF',
    background: '#1A1A1A',
    border: 'none',
    borderRadius: 10,
    marginBottom: 16,
  },
  subtleLink: {
    display: 'inline-block',
    fontSize: 14,
    color: '#888',
    textDecoration: 'underline',
  },
  thankYou: {
    padding: '10px 0',
  },
  checkmark: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#E6F4EA',
    color: '#1E7E34',
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },
  thankYouText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: 20,
  },
  googleButton: {
    display: 'inline-block',
    padding: '14px 28px',
    background: '#4285F4',
    color: '#FFF',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 15,
  },
  poweredBy: {
    fontSize: 11,
    color: '#BBB',
    marginTop: 28,
  },
}