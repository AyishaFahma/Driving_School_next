import { error } from 'console'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')

  if (!imageUrl) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  const res = await fetch(imageUrl)
  const blob = await res.blob()

  return new NextResponse(blob, {
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/jpeg',
      'Access-Control-Allow-Origin': '*',
    },
  })
} 

