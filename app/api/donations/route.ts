import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to our JSON data file
const dataPath = path.join(process.cwd(), 'data', 'donations.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(dataPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Read donations data
const readDonations = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading donations:', error)
  }
  
  // Return default structure if file doesn't exist
  return {
    equipment: [],
    categories: []
  }
}

// Write donations data
const writeDonations = (data: any) => {
  try {
    ensureDataDir()
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing donations:', error)
    return false
  }
}

// GET - Retrieve all donations and equipment data
export async function GET() {
  try {
    const data = readDonations()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

// POST - Add or update equipment item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data: itemData } = body
    
    const currentData = readDonations()
    
    if (action === 'addEquipment') {
      // Add new equipment item
      const newItem = {
        id: Date.now().toString(),
        name: itemData.name,
        target: parseFloat(itemData.target),
        progress: 0,
        funded: false,
        category: itemData.category,
        city: itemData.city,
        description: itemData.description || '',
        createdAt: new Date().toISOString()
      }
      
      currentData.equipment.push(newItem)
      
    } else if (action === 'updateEquipment') {
      // Update existing equipment item
      const index = currentData.equipment.findIndex((item: any) => item.id === itemData.id)
      if (index !== -1) {
        currentData.equipment[index] = { ...currentData.equipment[index], ...itemData }
      }
      
    } else if (action === 'addDonation') {
      // Add donation to equipment item
      const equipment = currentData.equipment.find((item: any) => item.id === itemData.equipmentId)
      if (equipment) {
        const donation = {
          id: Date.now().toString(),
          equipmentId: itemData.equipmentId,
          amount: parseFloat(itemData.amount),
          donorName: itemData.donorName || 'Anonymous',
          donorEmail: itemData.donorEmail || '',
          message: itemData.message || '',
          stripeSessionId: itemData.stripeSessionId || '',
          createdAt: new Date().toISOString()
        }
        
        if (!currentData.donations) currentData.donations = []
        currentData.donations.push(donation)
        
        // Update equipment progress
        const totalDonated = currentData.donations
          .filter((d: any) => d.equipmentId === itemData.equipmentId)
          .reduce((sum: number, d: any) => sum + d.amount, 0)
        
        equipment.progress = Math.min(100, Math.round((totalDonated / equipment.target) * 100))
        equipment.funded = equipment.progress >= 100
      }
    }
    
    if (writeDonations(currentData)) {
      return NextResponse.json({ success: true, data: currentData })
    } else {
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

// PUT - Update equipment progress (for admin use)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { equipmentId, progress } = body
    
    const currentData = readDonations()
    const equipment = currentData.equipment.find((item: any) => item.id === equipmentId)
    
    if (equipment) {
      equipment.progress = Math.min(100, Math.max(0, progress))
      equipment.funded = equipment.progress >= 100
      
      if (writeDonations(currentData)) {
        return NextResponse.json({ success: true, data: equipment })
      }
    }
    
    return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
