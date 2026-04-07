import { NextRequest, NextResponse } from 'next/server'

/**
 * Vehicle Spec Auto-Fetch API
 * 
 * This endpoint receives VIN/vehicle info and triggers n8n workflow
 * to auto-fetch specs from NHTSA, SerpAPI, and Unsplash
 * 
 * Expected request body:
 * {
 *   "vin": "1HGBH41JXMN109186",
 *   "make": "Honda",
 *   "model": "Accord",
 *   "year": 2012
 * }
 */

interface FetchSpecsRequest {
  vin?: string
  make: string
  model: string
  year: number
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FetchSpecsRequest

    // Validate input
    if (!body.make || !body.model || !body.year) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year' },
        { status: 400 }
      )
    }

    // Validate VIN if provided
    if (body.vin && body.vin.length !== 17) {
      return NextResponse.json(
        { error: 'VIN must be exactly 17 characters' },
        { status: 400 }
      )
    }

    // Call n8n webhook
    const n8nWebhookUrl = process.env.N8N_VEHICLE_SPECS_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.warn('[v0] N8N_VEHICLE_SPECS_WEBHOOK_URL not configured, returning fallback data')
      return NextResponse.json(getFallbackSpecs(body))
    }

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!n8nResponse.ok) {
        console.error('[v0] n8n webhook error:', n8nResponse.statusText)
        return NextResponse.json(getFallbackSpecs(body))
      }

      const data = await n8nResponse.json()
      return NextResponse.json(data)
    } catch (n8nError) {
      console.error('[v0] n8n webhook call failed:', n8nError)
      // Return fallback data if n8n fails
      return NextResponse.json(getFallbackSpecs(body))
    }
  } catch (error) {
    console.error('[v0] Error in fetch-specs endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle specifications' },
      { status: 500 }
    )
  }
}

/**
 * Fallback specs when n8n is unavailable
 * This ensures the app continues to work even if webhooks fail
 */
function getFallbackSpecs(body: FetchSpecsRequest) {
  return {
    success: true,
    source: 'fallback',
    data: {
      vehicle: {
        year: body.year,
        make: body.make,
        model: body.model,
        vin: body.vin || null,
      },
      specs: {
        engine_type: 'Unknown',
        transmission: 'Unknown',
        drivetrain: 'Unknown',
        fuel_type: 'Unknown',
        body_style: 'Unknown',
      },
      safety_features: [
        'Airbags',
        'Anti-lock Braking System (ABS)',
        'Traction Control',
        'Electronic Stability Control',
      ],
      amenities: [
        'Power Windows',
        'Power Locks',
        'Air Conditioning',
        'AM/FM Radio',
      ],
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop',
      ],
      estimated_value: null,
      market_comparables: [],
      message:
        'Unable to fetch real-time data. Basic specs provided. Configure N8N_VEHICLE_SPECS_WEBHOOK_URL for live data.',
    },
  }
}

/**
 * n8n Webhook Setup Instructions:
 *
 * 1. Create a new workflow in n8n
 * 2. Add Webhook trigger with POST method at: /autofleet/fetch-vehicle-specs
 * 3. Add these nodes in sequence:
 *
 *    A. HTTP Request (NHTSA API):
 *       - URL: https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{{$node["Webhook"].json["vin"]}}?format=json
 *       - Method: GET
 *       - Extract: engine, transmission, drivetrain, fuelType
 *
 *    B. HTTP Request (SerpAPI):
 *       - URL: https://serpapi.com/search?q={{$node["Webhook"].json["year"]}}+{{$node["Webhook"].json["make"]}}+{{$node["Webhook"].json["model"]}}+price&api_key={{$env["SERPAPI_KEY"]}}
 *       - Method: GET
 *       - Extract: estimated price and market comparables
 *
 *    C. HTTP Request (Unsplash API):
 *       - URL: https://api.unsplash.com/search/photos?query={{$node["Webhook"].json["year"]}}+{{$node["Webhook"].json["make"]}}+{{$node["Webhook"].json["model"]}}+car&per_page=10&client_id={{$env["UNSPLASH_KEY"]}}
 *       - Method: GET
 *       - Extract: high-quality car images
 *
 *    D. Merge Data Node:
 *       - Combine all responses into single output
 *
 *    E. Respond to Webhook with combined data
 *
 * 4. Set environment variables in n8n:
 *    - SERPAPI_KEY: Your SerpAPI key
 *    - UNSPLASH_KEY: Your Unsplash API key
 *
 * 5. Activate workflow and get webhook URL
 * 6. Add to project .env:
 *    N8N_VEHICLE_SPECS_WEBHOOK_URL=https://your-n8n-instance.com/webhook/autofleet/fetch-vehicle-specs
 *
 * Optional: Add error handling and retries in the n8n workflow
 */
